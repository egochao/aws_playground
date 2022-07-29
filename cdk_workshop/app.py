#!/usr/bin/env python3

import aws_cdk as cdk

# from cdk_workshop.cdk_workshop_stack import CdkWorkshopStack
from cdk_workshop.pipeline_stack import WorkshopStack

app = cdk.App()
WorkshopStack(app, "WorkshopPipelineStack")

app.synth()
