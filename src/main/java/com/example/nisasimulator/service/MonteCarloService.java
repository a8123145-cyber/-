package com.example.nisasimulator.service;

import com.example.nisasimulator.dto.SimulationRequest;
import com.example.nisasimulator.dto.SimulationResponse;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class MonteCarloService {

    private static final int NUM_TRIALS = 10000;
    private static final double NISA_LIFETIME_CAP_MAN = 1800.0; // 新NISA生涯投資枠 1,800万円
    private static final double NISA_ANNUAL_CAP_MAN = 360.0;    // 新NISA年間投資枠 360万円

    public static class FundParam {
        public final String id;
        public final String name;
        public final double mu;    // 50年データ比率法(2.6)補正後 年率ドリフト
        public final double sigma; // 50年データ比率法(2.6)補正後 年率ボラティリティ

        public FundParam(String id, String name, double mu, double sigma) {
            this.id = id;
            this.name = name;
            this.mu = mu;
            this.sigma = sigma;
        }
    }

    private static final Map<String, FundParam> FUNDS = Map.of(
        "sp500", new FundParam("sp500", "eMAXIS Slim 米国株式（S&P500）", 0.13720603, 0.15464710),
        "allcountry", new FundParam("allcountry", "eMAXIS Slim 全世界株式（オール・カントリー）", 0.12231996, 0.14532042),
        "topix", new FundParam("topix", "eMAXIS Slim 国内株式（TOPIX）", 0.06686388, 0.14321283),
        "balanced8", new FundParam("balanced8", "eMAXIS Slim バランス（8資産均等型）", 0.04342551, 0.10031176)
    );

    public SimulationResponse runSimulation(SimulationRequest req) {
        FundParam fund = FUNDS.getOrDefault(req.getFundId(), FUNDS.get("allcountry"));
        int totalYears = Math.max(1, Math.min(45, req.getEndAge() - req.getCurrentAge()));
        int totalMonths = totalYears * 12;

        double dt = 1.0 / 12.0;
        double drift = (fund.mu - 0.5 * fund.sigma * fund.sigma) * dt;
        double vol = fund.sigma * Math.sqrt(dt);

        double[] monthlyWithdrawals = new double[totalMonths + 1];
        Map<Integer, List<String>> yearLabels = new HashMap<>();
        double totalWithdrawals = 0.0;

        if (req.getLifeEvents() != null) {
            for (SimulationRequest.LifeEventItem ev : req.getLifeEvents()) {
                if (ev.getAmountMan() > 0 && ev.getYearsFromNow() >= 1 && ev.getYearsFromNow() <= totalYears) {
                    int mIdx = ev.getYearsFromNow() * 12;
                    monthlyWithdrawals[mIdx] += ev.getAmountMan();
                    totalWithdrawals += ev.getAmountMan();
                    yearLabels.computeIfAbsent(ev.getYearsFromNow(), k -> new ArrayList<>())
                              .add(ev.getLabel() + "(" + Math.round(ev.getAmountMan()) + "万円)");
                }
            }
        }

        double[] principalYearly = new double[totalYears + 1];
        double[] monthlyContrib = new double[totalMonths + 1];
        double cumulativeInvested = Math.min(NISA_LIFETIME_CAP_MAN, Math.max(0.0, req.getInitialAmountMan()));
        double cashNoInvest = cumulativeInvested;
        principalYearly[0] = cashNoInvest;

        double yearlyInvested = cumulativeInvested;
        for (int m = 1; m <= totalMonths; m++) {
            if ((m - 1) % 12 == 0 && m > 1) {
                yearlyInvested = 0.0;
            }
            double remLifetime = Math.max(0.0, NISA_LIFETIME_CAP_MAN - cumulativeInvested);
            double remAnnual = Math.max(0.0, NISA_ANNUAL_CAP_MAN - yearlyInvested);
            double contrib = Math.min(Math.max(0.0, req.getMonthlyAmountMan()), Math.min(remLifetime, remAnnual));

            monthlyContrib[m] = contrib;
            cumulativeInvested += contrib;
            yearlyInvested += contrib;

            cashNoInvest = Math.max(0.0, cashNoInvest + contrib - monthlyWithdrawals[m]);
            if (m % 12 == 0) {
                principalYearly[m / 12] = cashNoInvest;
            }
        }

        double[][] yearlyAssets = new double[totalYears + 1][NUM_TRIALS];
        double initAsset = Math.min(NISA_LIFETIME_CAP_MAN, Math.max(0.0, req.getInitialAmountMan()));
        Arrays.fill(yearlyAssets[0], initAsset);

        SplittableRandom rng = new SplittableRandom(20261127L);

        for (int t = 0; t < NUM_TRIALS; t++) {
            double asset = initAsset;
            for (int m = 1; m <= totalMonths; m++) {
                double z = rng.nextGaussian();
                double growth = Math.exp(drift + vol * z);
                asset = asset * growth + monthlyContrib[m];
                if (monthlyWithdrawals[m] > 0) {
                    asset = Math.max(0.0, asset - monthlyWithdrawals[m]);
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
            pt.setAge(req.getCurrentAge() + y);
            pt.setP10(percentile(arr, 10));
            pt.setP30(percentile(arr, 30));
            pt.setP50(percentile(arr, 50));
            pt.setP70(percentile(arr, 70));
            pt.setP90(percentile(arr, 90));
            pt.setPrincipal(principalYearly[y]);

            int mIdx = y * 12;
            pt.setEventWithdrawal(mIdx <= totalMonths ? monthlyWithdrawals[mIdx] : 0.0);
            pt.setEventLabels(yearLabels.containsKey(y) ? String.join("・", yearLabels.get(y)) : "");
            series.add(pt);
        }

        double[] finalArr = yearlyAssets[totalYears];
        double finalCash = principalYearly[totalYears];
        int beatCount = 0;
        for (double v : finalArr) {
            if (v >= finalCash) beatCount++;
        }

        SimulationResponse.YearlyPoint lastPt = series.get(series.size() - 1);
        SimulationResponse res = new SimulationResponse();
        res.setFundId(fund.id);
        res.setFundName(fund.name);
        res.setMu(fund.mu);
        res.setSigma(fund.sigma);
        res.setTrials(NUM_TRIALS);
        res.setSeries(series);
        res.setFinalP90(lastPt.getP90());
        res.setFinalP70(lastPt.getP70());
        res.setFinalP50(lastPt.getP50());
        res.setFinalP30(lastPt.getP30());
        res.setFinalP10(lastPt.getP10());
        res.setFinalPrincipal(finalCash);
        res.setTotalWithdrawals(totalWithdrawals);
        res.setAchievementRate((beatCount * 100.0) / NUM_TRIALS);
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
