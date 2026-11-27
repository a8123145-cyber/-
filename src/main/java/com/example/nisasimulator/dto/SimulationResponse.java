package com.example.nisasimulator.dto;

import java.util.List;

public class SimulationResponse {
    private String fundId;
    private String fundName;
    private double mu;
    private double sigma;
    private List<YearlyPoint> series;
    private double finalP70;
    private double finalP50;
    private double finalP30;
    private double finalP10;
    private double finalPrincipal;

    public static class YearlyPoint {
        private int year;
        private int age;
        private double p70;
        private double p50;
        private double p30;
        private double p10;
        private double principal;
        private double eventWithdrawal;
        private String eventShortLabel;

        public int getYear() { return year; }
        public void setYear(int year) { this.year = year; }
        public int getAge() { return age; }
        public void setAge(int age) { this.age = age; }
        public double getP70() { return p70; }
        public void setP70(double p70) { this.p70 = p70; }
        public double getP50() { return p50; }
        public void setP50(double p50) { this.p50 = p50; }
        public double getP30() { return p30; }
        public void setP30(double p30) { this.p30 = p30; }
        public double getP10() { return p10; }
        public void setP10(double p10) { this.p10 = p10; }
        public double getPrincipal() { return principal; }
        public void setPrincipal(double principal) { this.principal = principal; }
        public double getEventWithdrawal() { return eventWithdrawal; }
        public void setEventWithdrawal(double eventWithdrawal) { this.eventWithdrawal = eventWithdrawal; }
        public String getEventShortLabel() { return eventShortLabel; }
        public void setEventShortLabel(String eventShortLabel) { this.eventShortLabel = eventShortLabel; }
    }

    public String getFundId() { return fundId; }
    public void setFundId(String fundId) { this.fundId = fundId; }
    public String getFundName() { return fundName; }
    public void setFundName(String fundName) { this.fundName = fundName; }
    public double getMu() { return mu; }
    public void setMu(double mu) { this.mu = mu; }
    public double getSigma() { return sigma; }
    public void setSigma(double sigma) { this.sigma = sigma; }
    public List<YearlyPoint> getSeries() { return series; }
    public void setSeries(List<YearlyPoint> series) { this.series = series; }
    public double getFinalP70() { return finalP70; }
    public void setFinalP70(double finalP70) { this.finalP70 = finalP70; }
    public double getFinalP50() { return finalP50; }
    public void setFinalP50(double finalP50) { this.finalP50 = finalP50; }
    public double getFinalP30() { return finalP30; }
    public void setFinalP30(double finalP30) { this.finalP30 = finalP30; }
    public double getFinalP10() { return finalP10; }
    public void setFinalP10(double finalP10) { this.finalP10 = finalP10; }
    public double getFinalPrincipal() { return finalPrincipal; }
    public void setFinalPrincipal(double finalPrincipal) { this.finalPrincipal = finalPrincipal; }
}
