package main

import (
	"fmt"
	"net/http"
	"net/url"
	"strconv"
	"strings"

	"golang.org/x/net/html"
)

type CrawlResult struct {
	HTMLVersion     string         `json:"html_version"`
	PageTitle       string         `json:"page_title"`
	HeadingCount    map[string]int `json:"heading_count"`
	InternalLinks   int            `json:"internal_links"`
	ExternalLinks   int            `json:"external_links"`
	BrokenLinks     int            `json:"broken_links"`
	LoginFormFound  bool           `json:"login_form_found"`
}

func CrawlPage(target string) (*CrawlResult, error) {
	fmt.Println("Crawling......:", target)
	resp, err := http.Get(target)
	if err != nil {
		return nil, err
	}
	fmt.Println("Response Status:", resp.Status)
	defer resp.Body.Close()

	fmt.Println("Close the response body")

	doc, err := html.Parse(resp.Body)
	if err != nil {
		return nil, err
	}

	fmt.Println("Parsed HTML document")

	fmt.Println("Doc", doc)
	headingCount := make(map[string]int)
	for i := 1; i <= 6; i++ {
		tag := "h" + strconv.Itoa(i)
		headingCount[tag] = countTag(doc, tag)
	}

	links := extractLinks(doc)
	internal, external := classifyLinks(links, target)
	broken := checkBrokenLinks(append(internal, external...))
	loginFound := hasLoginForm(doc)

	return &CrawlResult{
		HTMLVersion:    getHTMLVersion(resp),
		PageTitle:      getTitle(doc),
		HeadingCount:   headingCount,
		InternalLinks:  len(internal),
		ExternalLinks:  len(external),
		BrokenLinks:    broken,
		LoginFormFound: loginFound,
	}, nil
}

func getHTMLVersion(resp *http.Response) string {
	ct := resp.Header.Get("Content-Type")
	if strings.Contains(ct, "text/html") {
		return "HTML5 or later"
	}
	return "Unknown"
}

func getTitle(n *html.Node) string {
	if n.Type == html.ElementNode && n.Data == "title" && n.FirstChild != nil {
		return n.FirstChild.Data
	}
	for c := n.FirstChild; c != nil; c = c.NextSibling {
		if t := getTitle(c); t != "" {
			return t
		}
	}
	return ""
}

func countTag(n *html.Node, tag string) int {
	count := 0
	if n.Type == html.ElementNode && n.Data == tag {
		count++
	}
	for c := n.FirstChild; c != nil; c = c.NextSibling {
		count += countTag(c, tag)
	}
	return count
}

func extractLinks(n *html.Node) []string {
	var links []string
	var f func(*html.Node)
	f = func(n *html.Node) {
		if n.Type == html.ElementNode && n.Data == "a" {
			for _, a := range n.Attr {
				if a.Key == "href" {
					links = append(links, a.Val)
				}
			}
		}
		for c := n.FirstChild; c != nil; c = c.NextSibling {
			f(c)
		}
	}
	f(n)
	return links
}

func classifyLinks(links []string, base string) (internal, external []string) {
	baseURL, _ := url.Parse(base)
	for _, link := range links {
		u, err := url.Parse(link)
		if err != nil {
			continue
		}
		if u.IsAbs() {
			if u.Host == baseURL.Host {
				internal = append(internal, u.String())
			} else {
				external = append(external, u.String())
			}
		} else {
			internal = append(internal, baseURL.ResolveReference(u).String())
		}
	}
	return
}

func checkBrokenLinks(links []string) int {
	broken := 0
	for _, link := range links {
		resp, err := http.Head(link)
		if err != nil || resp.StatusCode >= 400 {
			broken++
		}
	}
	return broken
}

func hasLoginForm(n *html.Node) bool {
	if n.Type == html.ElementNode && n.Data == "input" {
		for _, a := range n.Attr {
			if a.Key == "type" && a.Val == "password" {
				return true
			}
		}
	}
	for c := n.FirstChild; c != nil; c = c.NextSibling {
		if hasLoginForm(c) {
			return true
		}
	}
	return false
}
