# Buildkite — install and first use

[← Back to Buildkite](./README.md)

## Prerequisites

- Buildkite account/organization  
- A machine or autoscaling group that can reach Buildkite and your git/registry  
- Repo with permission to add a pipeline  

## Steps

1. Create a **pipeline** linked to your Git host.  
2. Add a `.buildkite/pipeline.yml` (or equivalent) with a test step.  
3. Install the **Buildkite agent** on a host or use the Elastic CI Stack / K8s agent patterns from current docs.  
4. Register the agent with an agent token; confirm it appears connected.  
5. Push a commit; confirm the agent runs the job.  
6. Add registry push + deploy steps using short-lived cloud identity where possible.  

## Verify

- Agent shows online.  
- Build badge/checks green on main.  
- Agent host cannot use standing prod credentials outside the job.  

## Next

- [Runners & caching](../11_Pipeline_As_Code_Runners_Caching_Matrix.md)  
- [Buildkite getting started](https://buildkite.com/docs/get-started)  
