import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

const steps = ["Pending", "Approved", "Shipped", "Delivered"];

export default function HorizontalLinearAlternativeLabelStepper() {
  return (
    <Box sx={{ width: "100%" }} className="flex justify-start mt-4">
      <Stepper activeStep={1} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
