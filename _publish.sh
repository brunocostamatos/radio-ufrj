#!/bin/sh

docker build -t registry.git.athenas.cisi.coppe.ufrj.br/cisi/dev/externo/radio/app:latest ./app
docker push registry.git.athenas.cisi.coppe.ufrj.br/cisi/dev/externo/radio/app:latest

docker build -t registry.git.athenas.cisi.coppe.ufrj.br/cisi/dev/externo/radio/api:latest ./api
docker push registry.git.athenas.cisi.coppe.ufrj.br/cisi/dev/externo/radio/api:latest
