# Forecast Demand

## Purpose
Generate demand forecasts using historical data and external drivers.

## Inputs
- product_id
- location
- historical_data
- forecast_horizon
- external_factors (optional)

## Instructions
Use the demand-forecaster agent.

Steps:
1. Analyze historical demand patterns
2. Identify seasonality and trends
3. Incorporate external factors if provided
4. Generate forecast for the specified horizon
5. Output confidence intervals

## Output
- forecast_values
- confidence_range
- key_drivers
- anomalies_detected