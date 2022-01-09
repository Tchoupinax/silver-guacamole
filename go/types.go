package main

type InputLink struct {
	URL string `json:"url"`
}

type Response struct {
	Status string      `json:"status"`
	Code   int16       `json:"code"`
	Data   interface{} `json:"data"`
}
