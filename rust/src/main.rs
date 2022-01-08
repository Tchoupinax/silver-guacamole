use hyper::{Body, Request, Response, Server};
use lazy_static::lazy_static;
use log::{debug, info};
use rand::distributions::Alphanumeric;
use rand::Rng;
use routerify::{Router, RouterService};
use routerify_json_response::json_success_resp;
use std::collections::HashMap;
use std::net::SocketAddr;
use std::sync::Mutex;

mod link;
use crate::link::*;

static PORT: i32 = 4020;
lazy_static! {
  static ref LINKS: Mutex<HashMap<String, String>> = {
    let m = HashMap::new();
    Mutex::new(m)
  };
}

async fn post_link(
  request: Request<Body>,
) -> Result<Response<Body>, routerify_json_response::Error> {
  debug!("post_link");

  let s: String = rand::thread_rng()
    .sample_iter(&Alphanumeric)
    .take(16)
    .map(char::from)
    .collect();

  let mut root = "http://localhost:4020/link/".to_string();
  root.push_str(&s);

  let c = s.to_string();

  let body = hyper::body::to_bytes(request.into_body()).await.unwrap();
  let input_link: InputLink = serde_json::from_slice(&body).unwrap();
  let name = input_link.url.clone();

  let mut map = LINKS.lock().unwrap();
  map.insert(s, name);

  let link = Link {
    token: c,
    url: root,
  };

  json_success_resp(&link)
}

async fn get_link(
  request: Request<Body>,
) -> Result<Response<Body>, routerify_json_response::Error> {
  debug!("get_link");

  let url = &request.uri().to_string();
  let split = url.split("/");
  let m: Vec<&str> = split.collect();
  let c = m;

  debug!("token = {}", c[2]);

  let answer_url = LINKS.lock().unwrap()[c[2]].clone();
  Ok(Response::new(Body::from(answer_url)))
}

async fn get_home(_: Request<Body>) -> Result<Response<Body>, routerify_json_response::Error> {
  debug!("get_home");

  Ok(Response::new(Body::from("OK")))
}

fn router() -> Router<Body, routerify_json_response::Error> {
  Router::builder()
    .get("/", get_home)
    .post("/link", post_link)
    .get("/link/:token", get_link)
    .build()
    .unwrap()
}

#[tokio::main]
async fn main() {
  let router = router();

  // Create a Service from the router above to handle incoming requests.
  let service = RouterService::new(router).unwrap();

  // The address on which the server will be listening.
  let addr = SocketAddr::from(([127, 0, 0, 1], 4020));

  // Create a server by passing the created service to `.serve` method.
  let server = Server::bind(&addr).serve(service);

  env_logger::init();
  info!("server listening on {}", PORT);
  if let Err(err) = server.await {
    eprintln!("Server error: {}", err);
  }
}
