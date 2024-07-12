NODE := "docker compose exec node"
PNPM := NODE + " pnpm"

ace *args:
	{{PNPM}} ace {{args}}

dev *args:
	{{PNPM}} dev {{args}}

pnpm *args:
	{{PNPM}} {{args}}

ncu:
	{{NODE}} ncu -iu

test suite="functional":
	NODE_ENV=testing {{NODE}} node ace test {{suite}}

shell:
	docker compose exec -it node bash

reset_db:
	{{PNPM}} ace db:wipe
	{{PNPM}} ace kysely:migrate
	{{PNPM}} ace db:seed
