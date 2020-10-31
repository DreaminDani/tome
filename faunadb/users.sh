CreateCollection({ name: "users" })
CreateIndex({
  name: "users_by_email",
  permissions: { read: "public"},
  source: Collection("users"),
  terms: [{field: ["data", "email"]}],
  unique: true,
})