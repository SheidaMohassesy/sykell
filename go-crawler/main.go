package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type CrawlRequest struct {
	URL string `json:"url" binding:"required,url"`
}


func main() {

	fmt.Println("main")
	fmt.Println("------------------------------")
	r := gin.Default()

	fmt.Println("before POST")

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

		//c.JSON(http.StatusOK, result)
		c.JSON(http.StatusOK, gin.H{
			"html_version":    result.HTMLVersion,
			"page_title":      result.PageTitle,
		})

	})

	r.Run(":8080")
}
