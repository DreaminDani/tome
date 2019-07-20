workflow "Deploy to PCF after build" {
  resolves = [
    "Deploy to PCF",
  ]
  on = "push"
}

action "Install" {
  uses = "nuxt/actions-yarn@master"
  args = "install --ignore-scripts"
}

action "Lint" {
  uses = "nuxt/actions-yarn@master"
  args = "lint"  
  needs = ["Install"]
}

action "Test" {
  uses = "nuxt/actions-yarn@master"
  needs = ["Lint"]
  args = "test"
}

action "If on master" {
  uses = "actions/bin/filter@0dbb077f64d0ec1068a644d25c71b1db66148a24"
  args = "branch master"
  needs = ["Test"]
}

action "Deploy to PCF" {
  uses = "d3sandoval/cloud-foundry-action@1.1.1"
  secrets = ["CF_USERNAME", "CF_PASSWORD"]
  env = {
    CF_TARGET_ORG = "dsandoval-org"
    CF_TARGET_SPACE = "development"
  }
  args = "push tome -b https://github.com/cloudfoundry/nodejs-buildpack"
  needs = ["If on master"]
}
