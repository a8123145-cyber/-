package com.example.nisasimulator.dto;

import java.util.List;

public class SimulationRequest {
    private String fundId;
    private int currentAge;
    private int endAge;
    private double initialAmountMan; // 万円
    private double monthlyAmountMan; // 万円
    private List<LifeEventItem> lifeEvents;

    public static class LifeEventItem {
        private String id;
        private String label;
        private int yearsFromNow;
        private double amountMan; // 万円

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }
        public int getYearsFromNow() { return yearsFromNow; }
        public void setYearsFromNow(int yearsFromNow) { this.yearsFromNow = yearsFromNow; }
        public double getAmountMan() { return amountMan; }
        public void setAmountMan(double amountMan) { this.amountMan = amountMan; }
    }

    public String getFundId() { return fundId; }
    public void setFundId(String fundId) { this.fundId = fundId; }
    public int getCurrentAge() { return currentAge; }
    public void setCurrentAge(int currentAge) { this.currentAge = currentAge; }
    public int getEndAge() { return endAge; }
    public void setEndAge(int endAge) { this.endAge = endAge; }
    public double getInitialAmountMan() { return initialAmountMan; }
    public void setInitialAmountMan(double initialAmountMan) { this.initialAmountMan = initialAmountMan; }
    public double getMonthlyAmountMan() { return monthlyAmountMan; }
    public void setMonthlyAmountMan(double monthlyAmountMan) { this.monthlyAmountMan = monthlyAmountMan; }
    public List<LifeEventItem> getLifeEvents() { return lifeEvents; }
    public void setLifeEvents(List<LifeEventItem> lifeEvents) { this.lifeEvents = lifeEvents; }
}
