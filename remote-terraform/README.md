# About

This image is to run terraform remotely on a bastion in case you need to provision against a private cloud provider whose api is not publicly available (ex: private openstack).

Underneat the hood, it uses ansible to do the remote execution of a terraform container on the bastion.

Also, its a quick POC done during an afternoon and might not be configurable enough (with non-local backends or by passing variables outside the configuration scripts for example) for some use-cases.

# Requirements

This image abstracts ansible away (except for the creation of a valid ansible hosts file which is pretty basic), but assumes proeficiency in Docker and Terraform in order to operate it successfully.

The launching environment and the bastion need to have Docker installed. 

Additionally, the bastion needs to have Python 3 and pip installed.

# Architecture

This image is executed outside of the bastion. It performs the following steps on the bastion:
- Copy the terraform configuration on the bastion
- Run terraform from inside a container on the bastion (passing the terraform configuration and state as mapped volumes and also running the container on the host network)

# Usage

Here is a usage example:

```
docker run -v $(pwd)/infra:/opt/terraform -v $(pwd)/hosts:/opt/inventory -v $HOME/.ssh/id_rsa:/opt/keys/id_rsa -v $HOME/.ssh/known_hosts:/root/.ssh/known_hosts -e "ANSIBLE_USER=ubuntu" magnitus/remote-terraform:latest terraform_plan
```

- The **infra** subdirectory in the working directory contains the terraform scripts
- The **hosts** file in the working directory is an ansible host file pointing to the bastion
- The **~/.ssh/id_rsa** is an ssh key that allows me to ssh to the bastion
- I will ssh to the bastion as the **ubuntu** user
- I'm just outputing the terraform plan by running the **terraform_plan** command. I could have also applied the resulting state change from the configuration by running the **terraform_apply** command.
- I'm mapping my local **known_hosts** fingerpring list (that has an entry for the bastion among others) to authentify the bastion. In a pipeline, you would probably generate the value once by running the following and passing it in your secrets:

```
ssh-keyscan -H <your bastion ip>
```

Alternatively, you can pass the following environment variable to your container to just disable host key checking, though it is less secure (are you feeling lucky?):

```
ANSIBLE_HOST_KEY_CHECKING=False
```

Additionally, I could have customized the execution further by passing the following environment variables:

- REMOTE_TERRAFORM_IMAGE: To use a image other than **hashicorp/terraform:latest** to run terraform on the bastion
- REMOTE_TERRAFORM_CONFIG_DIR: To copy the terraform scripts to a directory other than **/opt/terraform_config** on the bastion
- REMOTE_TERRAFORM_STATE_DIR: To store the terraform state file in a directory other than **/opt/terraform_state** on the bastion
- REMOTE_CONTAINER_NAME: To change the name of the container that will run on the bastion for something other than **terraform** (the container does get cleaned up at the end of the execution, but in case you want to run the provisioning of several environments at once and want to avoid container name clashes)

# Considered Alternatives

- No containers: Just installing ansible on the client and terraform on the target machine. Neither is overwelming (ansible is a pip package, terraform is a binary), but its an added operational step, everything becomes harder to upgrade (which is the kind of problems Docker solves to begin with) and ansible is not as abstracted away which takes cognitive resources away from the core focus (of running terraform configuration remotely).

- No Ansible: Bundle everything you need to run terraform (including the configuration scripts) in the launching environment and then deploy and run the image on the bastion. This gives more control with less glue code, but it more unweildy to deploy and troubleshoot: you need to build a versioned image each time you change your terraform configuration and then deploy it and run it on your bastion which would probably have to be converted into a pipeline runner, otherwise you're still stuck with the problem of sshing remotely which ansible was resolving to start with

- Terraform Backend: I was hopeful that terraform backends would provide a way to execute terraform remotely, but the focus of the solutions I looked at so far was more about managing shared access to terraform state files from either a local or Terraform Cloud execution.