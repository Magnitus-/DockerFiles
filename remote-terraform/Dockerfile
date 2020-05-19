FROM python:3.8-slim-buster

RUN apt-get update && apt-get install -y openssh-client sshpass
RUN pip install ansible==2.9.6

ENV ANSIBLE_STDOUT_CALLBACK=debug

ENV ANSIBLE_USER=admin
ENV PRIVATE_SSH_KEY=/opt/keys/id_rsa
ENV INVENTORY=/opt/inventory
ENV TERRAFORM_DIR=/opt/terraform

ENV REMOTE_TERRAFORM_CONFIG_DIR=/opt/terraform_config
ENV REMOTE_TERRAFORM_STATE_DIR=/opt/terraform_state
ENV REMOTE_TERRAFORM_IMAGE=hashicorp/terraform:latest
ENV REMOTE_CONTAINER_NAME=terraform

WORKDIR /opt

COPY ansible_scripts /opt/bastion_terraform
COPY binaries/apply /bin/terraform_apply
COPY binaries/plan /bin/terraform_plan

CMD ["terraform_plan"]