package com.example.nisasimulator.dto;

import java.util.List;

public class SimulationRequest {
    private String fundId;
    private int currentAge;
    private int endAge;
    private double monthlyAmountYen; // 円/月
    private List<LifeEventItem> lifeEvents;

    public static class LifeEventItem {
        private String id;
        private String label;
        private int targetAge;
        private double amountMan; // 万円

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }
        public int getTargetAge() { return targetAge; }
        public void setTargetAge(int targetAge) { this.targetAge = targetAge; }
        public double getAmountMan() { return amountMan; }
        public void setAmountMan(double amountMan) { this.amountMan = amountMan; }
    }

    public String getFundId() { return fundId; }
    public void setFundId(String fundId) { this.fundId = fundId; }
    public int getCurrentAge() { return currentAge; }
    public void setCurrentAge(int currentAge) { this.currentAge = currentAge; }
    public int getEndAge() { return endAge; }
    public void setEndAge(int endAge) { this.endAge = endAge; }
    public double getMonthlyAmountYen() { return monthlyAmountYen; }
    public void setMonthlyAmountYen(double monthlyAmountYen) { this.monthlyAmountYen = monthlyAmountYen; }
    public List<LifeEventItem> getLifeEvents() { return lifeEvents; }
    public void setLifeEvents(List<LifeEventItem> lifeEvents) { this.lifeEvents = lifeEvents; }
}
