# Unleash — install and first use

[← Back to Unleash](./README.md)

## Prerequisites

- Ability to run Unleash (Docker/compose or hosted) or use Unleash Cloud  
- An application where you can add an SDK  

## Steps

1. Start Unleash per [quickstart](https://docs.getunleash.io/guides/quickstart) (Docker is common for local).  
2. Log into the admin UI; create a project and a feature flag (boolean).  
3. Create an API token for the environment (development).  
4. Add the Unleash SDK to a sample app; initialize with the API URL + token.  
5. Gate a trivial code path on the flag; toggle in UI and confirm behavior changes **without** redeploy.  
6. For CI/CD: deploy with flag off; enable after smoke ([../5_Verify_Rollback_And_Synthetic_Tests.md](../5_Verify_Rollback_And_Synthetic_Tests.md)).  

## Verify

- Flag off → old behavior; flag on → new behavior.  
- Kill switch returns traffic to safe path during a drill.  

## Next

- [Deployment strategies](../3_Deployment_Strategies.md)  
- [Progressive delivery controllers](../9_Progressive_Delivery_Controllers.md)  
