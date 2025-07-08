package main

import (
	"fmt"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"

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
	fmt.Println("Crawling:", target)

	client := &http.Client{Timeout: 10 * time.Second}
	req, err := http.NewRequest("GET", target, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}
	req.Header.Set("User-Agent", "Mozilla/5.0 (compatible; MyBot/1.0)")

	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("HTTP error: %s", resp.Status)
	}

	doc, err := html.Parse(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to parse HTML: %w", err)
	}

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
	baseURL, err := url.Parse(base)
	if err != nil {
		return
	}
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
	client := http.Client{Timeout: 5 * time.Second}

	for _, link := range links {
		req, err := http.NewRequest("HEAD", link, nil)
		if err != nil {
			broken++
			continue
		}
		req.Header.Set("User-Agent", "Mozilla/5.0 (compatible; MyBot/1.0)")
		resp, err := client.Do(req)
		if err != nil || resp.StatusCode >= 400 {
			broken++
		}
		if resp != nil && resp.Body != nil {
			resp.Body.Close()
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
