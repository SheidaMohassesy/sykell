package main

import (
	"fmt"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type CrawlRequest struct {
	URL string `json:"url" binding:"required,url"`
}


func main() {
	r := gin.Default()
	r.Use(cors.Default())



	r.POST("/crawl", func(c *gin.Context) {
		var req CrawlRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid or missing URL"})
			return
		}

		result, err := CrawlPage(req.URL)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		fmt.Printf("Crawl result:\n%+v\n", result)

		c.JSON(http.StatusOK, gin.H{
			"html_version":    result.HTMLVersion,
			"page_title":      result.PageTitle,
			"heading_count":   result.HeadingCount,
			"internal_links":  result.InternalLinks,
			"external_links":  result.ExternalLinks,
			"broken_links":    result.BrokenLinks,
			"login_form_found": result.LoginFormFound,
		})

	})

	r.Run(":8080")
}
