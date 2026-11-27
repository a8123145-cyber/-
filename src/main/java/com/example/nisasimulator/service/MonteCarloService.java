package com.example.nisasimulator.service;

import com.example.nisasimulator.dto.SimulationRequest;
import com.example.nisasimulator.dto.SimulationResponse;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class MonteCarloService {

    private static final int NUM_TRIALS = 10000;
    private static final double NISA_LIFETIME_CAP_MAN = 1800.0;
    private static final double NISA_ANNUAL_CAP_MAN = 360.0;

    public static class FundParam {
        public final String id;
        public final String name;
        public final double mu;
        public final double sigma;

        public FundParam(String id, String name, double mu, double sigma) {
            this.id = id;
            this.name = name;
            this.mu = mu;
            this.sigma = sigma;
        }
    }

    private static final Map<String, FundParam> FUNDS = Map.of(
        "sp500", new FundParam("sp500", "eMAXIS Slim 米国株式 (S&P500)", 0.13720603, 0.15464710),
        "allcountry", new FundParam("allcountry", "eMAXIS Slim 全世界株式 (オール・カントリー)", 0.12231996, 0.14532042),
        "topix", new FundParam("topix", "eMAXIS Slim 国内株式 (TOPIX)", 0.06686388, 0.14321283),
        "balanced8", new FundParam("balanced8", "eMAXIS Slim バランス (8資産均等型)", 0.04342551, 0.10031176)
    );

    public SimulationResponse runSimulation(SimulationRequest req) {
        FundParam fund = FUNDS.getOrDefault(req.getFundId(), FUNDS.get("sp500"));
        int currentAge = Math.max(18, Math.min(64, req.getCurrentAge()));
        int endAge = req.getEndAge() > currentAge ? req.getEndAge() : 65;
        int totalYears = Math.max(1, endAge - currentAge);
        int totalMonths = totalYears * 12;

        double monthlyMan = Math.max(0.0, req.getMonthlyAmountYen()) / 10000.0;

        double dt = 1.0 / 12.0;
        double drift = (fund.mu - 0.5 * fund.sigma * fund.sigma) * dt;
        double vol = fund.sigma * Math.sqrt(dt);

        double[] monthlyWithdrawals = new double[totalMonths + 1];
        Map<Integer, List<String>> yearLabels = new HashMap<>();

        if (req.getLifeEvents() != null) {
            for (SimulationRequest.LifeEventItem ev : req.getLifeEvents()) {
                int yrOffset = ev.getTargetAge() - currentAge;
                if (ev.getAmountMan() > 0 && yrOffset >= 1 && yrOffset <= totalYears) {
                    int mIdx = yrOffset * 12;
                    monthlyWithdrawals[mIdx] += ev.getAmountMan();
                    yearLabels.computeIfAbsent(yrOffset, k -> new ArrayList<>()).add(ev.getLabel());
                }
            }
        }

        double[] principalYearly = new double[totalYears + 1];
        double[] monthlyContrib = new double[totalMonths + 1];
        double cumulativeInvested = 0.0;
        double cashNoInvest = 0.0;
        double yearlyInvested = 0.0;

        for (int m = 1; m <= totalMonths; m++) {
            if ((m - 1) % 12 == 0 && m > 1) {
                yearlyInvested = 0.0;
            }
            double remLifetime = Math.max(0.0, NISA_LIFETIME_CAP_MAN - cumulativeInvested);
            double remAnnual = Math.max(0.0, NISA_ANNUAL_CAP_MAN - yearlyInvested);
            double contrib = Math.min(monthlyMan, Math.min(remLifetime, remAnnual));

            monthlyContrib[m] = contrib;
            cumulativeInvested += contrib;
            yearlyInvested += contrib;

            // Allow negative balance when life events exceed accumulated assets (matching original behavior)
            cashNoInvest = cashNoInvest + contrib - monthlyWithdrawals[m];
            if (m % 12 == 0) {
                principalYearly[m / 12] = cashNoInvest;
            }
        }

        double[][] yearlyAssets = new double[totalYears + 1][NUM_TRIALS];
        SplittableRandom rng = new SplittableRandom(20261127L);

        for (int t = 0; t < NUM_TRIALS; t++) {
            double asset = 0.0;
            for (int m = 1; m <= totalMonths; m++) {
                double z = rng.nextGaussian();
                double growth = Math.exp(drift + vol * z);
                // Only apply market return to positive invested balance; debt/deficit does not compound negatively
                if (asset > 0) {
                    asset = asset * growth + monthlyContrib[m];
                } else {
                    asset = asset + monthlyContrib[m];
                }
                if (monthlyWithdrawals[m] > 0) {
                    asset = asset - monthlyWithdrawals[m];
                }
                if (m % 12 == 0) {
                    yearlyAssets[m / 12][t] = asset;
                }
            }
        }

        List<SimulationResponse.YearlyPoint> series = new ArrayList<>();
        for (int y = 0; y <= totalYears; y++) {
            double[] arr = yearlyAssets[y];
            Arrays.sort(arr);

            SimulationResponse.YearlyPoint pt = new SimulationResponse.YearlyPoint();
            pt.setYear(y);
            pt.setAge(currentAge + y);
            pt.setP10(percentile(arr, 10));
            pt.setP30(percentile(arr, 30));
            pt.setP50(percentile(arr, 50));
            pt.setP70(percentile(arr, 70));
            pt.setPrincipal(principalYearly[y]);

            int mIdx = y * 12;
            pt.setEventWithdrawal(mIdx <= totalMonths ? monthlyWithdrawals[mIdx] : 0.0);
            pt.setEventShortLabel(yearLabels.containsKey(y) ? String.join("・", yearLabels.get(y)) : "");
            series.add(pt);
        }

        SimulationResponse.YearlyPoint lastPt = series.get(series.size() - 1);
        SimulationResponse res = new SimulationResponse();
        res.setFundId(fund.id);
        res.setFundName(fund.name);
        res.setMu(fund.mu);
        res.setSigma(fund.sigma);
        res.setSeries(series);
        res.setFinalP70(lastPt.getP70());
        res.setFinalP50(lastPt.getP50());
        res.setFinalP30(lastPt.getP30());
        res.setFinalP10(lastPt.getP10());
        res.setFinalPrincipal(lastPt.getPrincipal());
        return res;
    }

    private double percentile(double[] sorted, double p) {
        double idx = (p / 100.0) * (sorted.length - 1);
        int lower = (int) Math.floor(idx);
        int upper = (int) Math.ceil(idx);
        if (lower == upper) return sorted[lower];
        double weight = idx - lower;
        return sorted[lower] * (1.0 - weight) + sorted[upper] * weight;
    }
}
