package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"silver-guacamole/utils"

	log "github.com/sirupsen/logrus"

	"github.com/gorilla/mux"
)

var (
	// nolint gochecknoglobals
	LINKS = make(map[string]string)
	// nolint gochecknoglobals
	PORT = 4010
)

func getHome(w http.ResponseWriter, r *http.Request) {
	log.Debug("getHome")

	w.WriteHeader(http.StatusOK)

	fmt.Fprintf(w, "OK")
}

func getLink(w http.ResponseWriter, r *http.Request) {
	var params = mux.Vars(r)
	var token = params["token"]

	log.Debug(fmt.Sprintf("getLink [token=%s]", params["token"]))

	w.WriteHeader(http.StatusOK)
	_, _ = w.Write([]byte(LINKS[token]))
}

func postLink(w http.ResponseWriter, r *http.Request) {
	if r.Body == nil {
		http.Error(w, "Please send a request body", 400)
		return
	}

	token := utils.RandomString(16)

	var inputLink InputLink
	err := json.NewDecoder(r.Body).Decode(&inputLink)
	if err != nil {
		fmt.Print(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	log.Debug(fmt.Sprintf("postLink [url=%s]", inputLink.URL))

	LINKS[token] = inputLink.URL

	linkBody := map[string]interface{}{
		"url":   fmt.Sprintf("%s%d%s%s", "http://localhost:", PORT, "/link/", token),
		"token": token,
	}

	data := &Response{
		Status: "success",
		Code:   200,
		Data:   linkBody,
	}

	payload, err := json.Marshal(data)
	if err != nil {
		log.Println(err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	_, _ = w.Write(payload)
}

func main() {
	log.SetLevel(log.DebugLevel)

	r := mux.NewRouter()
	r.HandleFunc("/", getHome).Methods("GET")
	r.HandleFunc("/link", postLink).Methods("POST")
	r.HandleFunc("/link/{token}", getLink).Methods("GET")

	http.Handle("/", r)

	srv := &http.Server{
		Handler: r,
		Addr:    fmt.Sprintf("127.0.0.1:%d", PORT),
		// Good practice: enforce timeouts for servers you create!
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
		IdleTimeout:  15 * time.Second,
	}

	log.Info(fmt.Sprintf("server listening on %d", PORT))
	log.Fatal(srv.ListenAndServe())
}
