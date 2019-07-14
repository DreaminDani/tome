workflow "Deploy to PCF after build" {
  resolves = ["Deploy to PCF"]
  on = "push"
}

action "Deploy to PCF" {
  uses = "d3sandoval/cloud-foundry-action@1.1.0"
  secrets = ["CF_USERNAME", "CF_PASSWORD"]
  env = {
    CF_TARGET_ORG = "dsandoval-org"
    CF_TARGET_SPACE = "development"
  }
  args = "push tome -b https://github.com/cloudfoundry/nodejs-buildpack"
}
