set NODE_ENV=development
set GRAPHQL_URI=http://api-gateway-uat.default.svc.cluster.local:4000/graphql
set BROWSER_GRAPHQL_URI= https://api-gateway-uat.lachouquette.ch/graphql
set SITE_URL=https://uat.lachouquette.ch

set SEED=%RANDOM%

docker build . -t chouquette-spa-uat || exit /b
docker tag chouquette-spa-uat docker.lachouquette.ch/chouquette-spa-uat:%SEED% || exit /b
docker push docker.lachouquette.ch/chouquette-spa-uat:%SEED% || exit /b

kubectl set image deployment/chouquette-spa-uat chouquette-spa-uat=docker.lachouquette.ch/chouquette-spa-uat:%SEED%
