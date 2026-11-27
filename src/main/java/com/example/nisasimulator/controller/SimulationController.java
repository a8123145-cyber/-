package com.example.nisasimulator.controller;

import com.example.nisasimulator.dto.SimulationRequest;
import com.example.nisasimulator.dto.SimulationResponse;
import com.example.nisasimulator.service.MonteCarloService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
public class SimulationController {

    private final MonteCarloService monteCarloService;

    public SimulationController(MonteCarloService monteCarloService) {
        this.monteCarloService = monteCarloService;
    }

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @PostMapping("/api/simulate")
    @ResponseBody
    public SimulationResponse simulate(@RequestBody SimulationRequest request) {
        return monteCarloService.runSimulation(request);
    }
}
