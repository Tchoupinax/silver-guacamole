use serde::ser::{Serialize, SerializeStruct, Serializer};
use serde::Deserialize;

pub struct Link {
  pub url: String,
  pub token: String,
}

#[derive(Deserialize)]
pub struct InputLink {
  pub url: String,
}

impl Serialize for Link {
  fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
  where
    S: Serializer,
  {
    let mut s = serializer.serialize_struct("Link", 2)?;
    s.serialize_field("url", &self.url)?;
    s.serialize_field("token", &self.token)?;
    s.end()
  }
}
