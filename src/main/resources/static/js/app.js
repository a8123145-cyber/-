$(function () {
    // 13 Risk Tolerance Questions (Q5 - Q18, exact text from original design)
    const RISK_QUESTIONS = [
        {
            id: 'q5', num: 'Q5.',
            text: 'あなたの親しい友人は、あなたを「どのくらいリスクを取る人」だと思っているでしょうか？',
            options: [
                { label: 'a. 大きなリスクでも、積極的に挑戦する人', score: 4 },
                { label: 'b. 十分に調べて納得できれば、リスクを取る人', score: 3 },
                { label: 'c. できるだけ慎重に判断する人', score: 2 },
                { label: 'd. リスクは絶対に取りたくない人', score: 1 }
            ]
        },
        {
            id: 'q6', num: 'Q6.',
            text: 'テレビのゲーム番組で、賞金をもらえるチャンスがあります。あなたならどれを選びますか？（※b〜dは当たらなければ賞金はもらえません）',
            options: [
                { label: 'a. 必ず10万円もらえる', score: 1 },
                { label: 'b. 50%の確率で50万円もらえる', score: 2 },
                { label: 'c. 25%の確率で100万円もらえる', score: 3 },
                { label: 'd. 5%の確率で1,000万円もらえる', score: 4 }
            ]
        },
        {
            id: 'q7', num: 'Q7.',
            text: 'あなたは、一生に一度の特別な旅行のためにお金を貯めてきました。しかし、旅行の3週間前に仕事を失い、収入がなくなってしまいました。あなたならどうしますか？',
            options: [
                { label: 'a. 旅行をキャンセルする', score: 1 },
                { label: 'b. 旅行には行くが、お金をあまり使わない旅行に変更する', score: 2 },
                { label: 'c. 予定を変えず、そのまま旅行に行く（気分転換も必要だと思うため）', score: 3 },
                { label: 'd. 旅行をさらに長くする（こんな機会は二度とないかもしれないため）', score: 4 }
            ]
        },
        {
            id: 'q8', num: 'Q8.',
            text: 'もし突然、自由に投資できるお金として200万円をもらったら、どうしますか？',
            options: [
                { label: 'a. 銀行に預けるなど、お金が減るリスクの小さい方法を選ぶ', score: 1 },
                { label: 'b. 国や企業にお金を貸して利息を受け取る「債券」や、債券を中心に運用する投資信託を買う', score: 2.5 },
                { label: 'c. 企業の株式や、株式を中心に運用する投資信託を買う', score: 4 }
            ]
        },
        {
            id: 'q9', num: 'Q9.',
            text: '株式や、株式を中心に運用する投資信託にお金を投資することについて、どう感じますか？',
            options: [
                { label: 'a. とても不安で、できれば投資したくない', score: 1 },
                { label: 'b. 少し不安はあるが、投資することも考えられる', score: 2.5 },
                { label: 'c. 特に不安はない', score: 4 }
            ]
        },
        {
            id: 'q10', num: 'Q10.',
            text: '「リスク」という言葉を聞いたとき、最初に思い浮かぶのはどれですか？',
            options: [
                { label: 'a. お金などを失うこと', score: 1 },
                { label: 'b. この先どうなるか分からないこと', score: 2 },
                { label: 'c. 利益や成功を得られるチャンス', score: 3 },
                { label: 'd. ドキドキする刺激や興奮', score: 4 }
            ]
        },
        {
            id: 'q11', num: 'Q11.',
            text: '専門家は「今後、金や不動産などの価格は上がり、債券の価格は下がるだろう」と予想しています。あなたは現在、投資しているお金の大部分を国債で持っていますが、どうしますか？',
            options: [
                { label: 'a. 今持っている国債を、そのまま持ち続ける', score: 1 },
                { label: 'b. 国債を売り、半分を銀行預金などに、もう半分を金や不動産などに投資する', score: 2 },
                { label: 'c. 国債をすべて売り、そのお金をすべて金や不動産などに投資する', score: 3 },
                { label: 'd. 国債をすべて売って金や不動産などに投資し、さらにお金を借りて追加で投資する', score: 4 }
            ]
        },
        {
            id: 'q12', num: 'Q12.',
            text: '次の4つの投資方法があります。うまくいった場合の利益と、失敗した場合の損失を見て、最も魅力的だと思うものを選んでください。',
            options: [
                { label: 'a. うまくいけば2万円の利益。失敗しても損失はない', score: 1 },
                { label: 'b. うまくいけば8万円の利益。失敗すると2万円を失う', score: 2 },
                { label: 'c. うまくいけば26万円の利益。失敗すると8万円を失う', score: 3 },
                { label: 'd. うまくいけば48万円の利益。失敗すると24万円を失う', score: 4 }
            ]
        },
        {
            id: 'q13', num: 'Q13.',
            text: 'あなたは新たに10万円をもらいました。さらにお金をもらえるチャンスがあります。あなたならどちらを選びますか？',
            options: [
                { label: 'a. 必ず、さらに5万円をもらう', score: 1.5 },
                { label: 'b. 50%の確率でさらに10万円をもらい、残りの50%の確率では追加のお金をもらえない', score: 3.5 }
            ]
        },
        {
            id: 'q14', num: 'Q14.',
            text: 'あなたは新たに20万円をもらいました。しかし、次のどちらかの方法でお金を失わなければなりません。あなたならどちらを選びますか？',
            options: [
                { label: 'a. 必ず5万円を失う', score: 1.5 },
                { label: 'b. 50%の確率で10万円を失うが、残りの50%の確率では1円も失わない', score: 3.5 }
            ]
        },
        {
            id: 'q16', num: 'Q16.',
            text: '親戚から1,000万円を相続しました。ただし、「1,000万円すべてを、次の4つのうちどれか1つに投資すること」という条件があります。どれを選びますか？',
            options: [
                { label: 'a. 普通預金や、比較的安全性が高い短期の金融商品（MMF）', score: 1 },
                { label: 'b. 株式と債券の両方を組み合わせて運用する投資信託（バランス型）', score: 2 },
                { label: 'c. 異なる15社の株式を組み合わせて持つ投資方法', score: 3 },
                { label: 'd. 金・銀・原油など、価格が変動する資源や商品に投資する方法', score: 4 }
            ]
        },
        {
            id: 'q17', num: 'Q17.',
            text: '200万円を投資するとします。次の3つのうち、最も魅力的だと思うお金の分け方はどれですか？',
            options: [
                { label: 'a. 低リスクの投資に60%、中くらいのリスクの投資に30%、高リスクの投資に10%', score: 1 },
                { label: 'b. 低リスクの投資に30%、中くらいのリスクの投資に40%、高リスクの投資に30%', score: 2.5 },
                { label: 'c. 低リスクの投資に10%、中くらいのリスクの投資に40%、高リスクの投資に50%', score: 4 }
            ]
        },
        {
            id: 'q18', num: 'Q18.',
            text: '信頼している地質学者の友人から、金を探す事業への投資を勧められました。成功すれば50〜100倍になりますが、成功確率は20%で、失敗すればすべてなくなります。いくら投資しますか？',
            options: [
                { label: 'a. 全く投資しない', score: 1 },
                { label: 'b. 給料の1か月分', score: 2 },
                { label: 'c. 給料の3か月分', score: 3 },
                { label: 'd. 給料の半年分', score: 4 }
            ]
        }
    ];

    const answers = {};
    let recommendedFundId = 'sp500';
    let selectedFundId = 'sp500';
    let recommendedMonthlyYen = 24000;
    let currentMonthlyYen = 24000;
    let isZoomed = false;
    let latestResponse = null;
    let chartObj = null;

    // Render Step 2 Questions
    const $qContainer = $('#riskQuestionsContainer');
    RISK_QUESTIONS.forEach(q => {
        const $card = $('<div class="q-card"></div>');
        $card.append('<div class="q-label"><span class="q-num-blue">' + q.num + '</span> ' + q.text + '</div>');
        const $opts = $('<div class="opt-list"></div>');
        q.options.forEach(opt => {
            const $btn = $('<button type="button" class="opt-btn">' + opt.label + '</button>');
            $btn.on('click', function () {
                $opts.find('.opt-btn').removeClass('selected');
                $(this).addClass('selected');
                answers[q.id] = opt.score;
                checkAllRiskAnswered();
            });
            $opts.append($btn);
        });
        $card.append($opts);
        $qContainer.append($card);
    });

    function checkAllRiskAnswered() {
        const answeredCount = Object.keys(answers).length;
        const $btn = $('#btnToStep3');
        if (answeredCount === RISK_QUESTIONS.length) {
            $btn.prop('disabled', false)
                .removeClass('btn-disabled')
                .addClass('btn-blue')
                .text('次へ進む（ライフプラン設定）');
        }
    }

    // Navigation helper
    function showView(viewId, stepNum) {
        $('.view-section').removeClass('active');
        $('#' + viewId).addClass('active');
        if (stepNum) {
            $('#stepNavWrapper').removeClass('hidden');
            $('.nav-item').removeClass('active');
            $('.nav-item[data-nav="' + stepNum + '"]').addClass('active');
        } else {
            $('#stepNavWrapper').addClass('hidden');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    $('#btnStartSim').on('click', () => showView('view-step1', 1));
    $('#btnBackToIntro').on('click', () => showView('view-intro', null));
    $('#btnToStep2').on('click', () => showView('view-step2', 2));
    $('#btnBackToStep1').on('click', () => showView('view-step1', 1));
    $('#btnToStep3').on('click', () => {
        if (Object.keys(answers).length === RISK_QUESTIONS.length) {
            showView('view-step3', 3);
        }
    });
    $('#btnBackToStep2').on('click', () => showView('view-step2', 2));
    $('#btnBackToLifePlan').on('click', () => showView('view-step3', 3));
    $('#btnResetAll').on('click', () => showView('view-intro', null));

    // Q4 experience toggle
    $('#q4_choices .choice-pill').on('click', function () {
        $('#q4_choices .choice-pill').removeClass('active');
        $(this).addClass('active');
    });

    // Step 3 checkbox toggles
    ['q19', 'q20', 'q21_1', 'q21_2', 'q22'].forEach(ev => {
        $('#' + ev + '_check').on('change', function () {
            $('#' + ev + '_body').toggleClass('hidden', !$(this).is(':checked'));
        });
        if ($('#' + ev + '_unknown').length) {
            $('#' + ev + '_unknown').on('change', function () {
                $('#' + ev + '_custom_wrap').toggleClass('hidden', $(this).is(':checked'));
            });
        }
    });

    // Determine Recommended Fund & Monthly Amount
    function evaluateUserProfile() {
        const q3Investable = parseFloat($('#q3_investable').val()) || 30000;
        const expScore = parseInt($('#q4_choices .choice-pill.active').data('score'), 10) || 1;

        let totalScore = 0;
        Object.values(answers).forEach(v => totalScore += v);
        const avgScore = totalScore / RISK_QUESTIONS.length; // 1.0 - 4.0

        // Recommended fund by risk tolerance
        if (avgScore >= 2.85) {
            recommendedFundId = 'sp500';
        } else if (avgScore >= 2.25) {
            recommendedFundId = 'allcountry';
        } else if (avgScore >= 1.75) {
            recommendedFundId = 'topix';
        } else {
            recommendedFundId = 'balanced8';
        }

        // Recommended monthly amount (80% of investable surplus, rounded to 1,000円)
        const ratio = expScore === 1 ? 0.8 : (expScore === 2 ? 0.85 : 0.9);
        recommendedMonthlyYen = Math.max(1000, Math.round((q3Investable * ratio) / 1000) * 1000);
        if (recommendedMonthlyYen > 100000) recommendedMonthlyYen = 100000;

        selectedFundId = recommendedFundId;
        currentMonthlyYen = recommendedMonthlyYen;

        $('.ft-rec-tag').addClass('hidden');
        $('.ft-rec-tag[data-rec="' + recommendedFundId + '"]').removeClass('hidden');
        $('.fund-tab').removeClass('active');
        $('.fund-tab[data-fund="' + selectedFundId + '"]').addClass('active');

        $('#monthlyAdjustSlider').val(currentMonthlyYen);
        $('#sliderCurrentVal').text(currentMonthlyYen.toLocaleString() + '円');
    }

    function collectLifeEvents() {
        const events = [];
        if ($('#q19_check').is(':checked')) {
            const amt = $('#q19_unknown').is(':checked') ? 327 : (parseFloat($('#q19_amount').val()) || 0);
            events.push({ id: 'q19', label: '結婚', targetAge: parseInt($('#q19_age').val(), 10) || 30, amountMan: amt });
        }
        if ($('#q20_check').is(':checked')) {
            const amt = $('#q20_unknown').is(':checked') ? 500 : (parseFloat($('#q20_amount').val()) || 0);
            events.push({ id: 'q20', label: '住宅購入(頭金)', targetAge: parseInt($('#q20_age').val(), 10) || 40, amountMan: amt });
        }
        if ($('#q21_1_check').is(':checked')) {
            const amt = $('#q21_1_unknown').is(':checked') ? 500 : (parseFloat($('#q21_1_amount').val()) || 0);
            events.push({ id: 'q21_1', label: '教育(幼稚園〜高校)', targetAge: parseInt($('#q21_1_age').val(), 10) || 33, amountMan: amt });
        }
        if ($('#q21_2_check').is(':checked')) {
            const amt = $('#q21_2_unknown').is(':checked') ? 500 : (parseFloat($('#q21_2_amount').val()) || 0);
            events.push({ id: 'q21_2', label: '教育(大学)', targetAge: parseInt($('#q21_2_age').val(), 10) || 45, amountMan: amt });
        }
        if ($('#q22_check').is(':checked')) {
            const amt = parseFloat($('#q22_amount').val()) || 0;
            events.push({ id: 'q22', label: 'その他支出', targetAge: parseInt($('#q22_age').val(), 10) || 35, amountMan: amt });
        }
        return events;
    }

    function executeSimulation(switchToResultView) {
        const currentAge = parseInt($('#q1_age').val(), 10) || 23;
        const payload = {
            fundId: selectedFundId,
            currentAge: currentAge,
            endAge: 65,
            monthlyAmountYen: currentMonthlyYen,
            lifeEvents: collectLifeEvents()
        };

        $('#loadingModal').removeClass('hidden');

        $.ajax({
            url: '/api/simulate',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(payload),
            success: function (res) {
                $('#loadingModal').addClass('hidden');
                latestResponse = res;
                updateResultUI(res);
                if (switchToResultView) {
                    showView('view-result', null);
                }
            },
            error: function (err) {
                $('#loadingModal').addClass('hidden');
                alert('シミュレーション計算中にエラーが発生しました。');
                console.error(err);
            }
        });
    }

    $('#btnShowResult').on('click', function () {
        evaluateUserProfile();
        isZoomed = false;
        $('#btnZoomToggle').removeClass('active').text('少額帯・出費を拡大');
        executeSimulation(true);
    });

    // Fund tab switching on result page
    $('.fund-tab').on('click', function () {
        selectedFundId = $(this).data('fund');
        $('.fund-tab').removeClass('active');
        $(this).addClass('active');
        executeSimulation(false);
    });

    // Monthly slider adjustment on result page
    let sliderTimer = null;
    $('#monthlyAdjustSlider').on('input', function () {
        currentMonthlyYen = parseInt($(this).val(), 10) || 0;
        $('#sliderCurrentVal').text(currentMonthlyYen.toLocaleString() + '円');
        $('#resMonthlyText').text(currentMonthlyYen.toLocaleString());
        clearTimeout(sliderTimer);
        sliderTimer = setTimeout(() => executeSimulation(false), 180);
    });

    // Zoom toggle button
    $('#btnZoomToggle').on('click', function () {
        isZoomed = !isZoomed;
        $(this).toggleClass('active', isZoomed)
               .text(isZoomed ? '全体表示に戻す' : '少額帯・出費を拡大');
        if (latestResponse) {
            renderChart(latestResponse);
        }
    });

    function fmtManSigned(v) {
        const rounded = Math.round(v);
        return rounded.toLocaleString('ja-JP') + '万円';
    }

    function updateResultUI(res) {
        const currentAge = parseInt($('#q1_age').val(), 10) || 23;
        const years = Math.max(1, 65 - currentAge);

        $('#resSelectedFundName').text(res.fundName);
        $('#resRecommendBadge').toggleClass('hidden', res.fundId !== recommendedFundId);
        $('#resMonthlyText').text(currentMonthlyYen.toLocaleString());
        $('#resAgeSubText').text('開始年齢：' + currentAge + '歳 / 65歳まで運用（' + years + '年間）');

        $('#valP70').text(fmtManSigned(res.finalP70));
        $('#valP50').text(fmtManSigned(res.finalP50));
        $('#valP30').text(fmtManSigned(res.finalP30));
        $('#valP10').text(fmtManSigned(res.finalP10));
        $('#valPrincipal').text(fmtManSigned(res.finalPrincipal));

        renderChart(res);
    }

    // Custom Chart.js plugin to draw event text labels (結婚, 住宅購入(頭金), 教育...) above curve
    const eventLabelPlugin = {
        id: 'eventLabelPlugin',
        afterDatasetsDraw(chart) {
            if (!latestResponse || !latestResponse.series) return;
            const { ctx } = chart;
            const meta = chart.getDatasetMeta(0); // 上位30% line
            ctx.save();
            ctx.font = 'bold 11px sans-serif';
            ctx.fillStyle = '#1e293b';
            ctx.textAlign = 'center';

            latestResponse.series.forEach((pt, idx) => {
                if (pt.eventShortLabel && idx > 0 && meta.data[idx]) {
                    // Place label right before the drop (at previous year point if available)
                    const targetEl = meta.data[Math.max(0, idx - 1)];
                    ctx.fillText(pt.eventShortLabel, targetEl.x, targetEl.y - 12);
                }
            });
            ctx.restore();
        }
    };

    function renderChart(res) {
        const series = res.series;
        const labels = series.map(pt => pt.age + '歳');
        const p70 = series.map(pt => Math.round(pt.p70));
        const p50 = series.map(pt => Math.round(pt.p50));
        const p30 = series.map(pt => Math.round(pt.p30));
        const p10 = series.map(pt => Math.round(pt.p10));
        const principal = series.map(pt => Math.round(pt.principal));

        // Calculate Y-axis zoom range when "少額帯・出費を拡大" is active
        let yMax = undefined;
        if (isZoomed) {
            const first15 = series.slice(0, Math.min(16, series.length));
            const maxEarly = Math.max(...first15.map(d => d.p70), 400);
            yMax = Math.ceil(maxEarly / 100) * 100;
        }

        if (chartObj) chartObj.destroy();

        const ctx = document.getElementById('nisaResultChart').getContext('2d');
        chartObj = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: '上位30%',
                        data: p70,
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.08)',
                        borderWidth: 2,
                        pointRadius: 0,
                        tension: 0.15,
                        fill: 3 // Fill ONLY between 上位30% (red) and 下位10% (cyan)
                    },
                    {
                        label: '中央値',
                        data: p50,
                        borderColor: '#f59e0b',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        pointRadius: 0,
                        tension: 0.15,
                        fill: false
                    },
                    {
                        label: '下位30%',
                        data: p30,
                        borderColor: '#16a34a',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        pointRadius: 0,
                        tension: 0.15,
                        fill: false
                    },
                    {
                        label: '下位10%',
                        data: p10,
                        borderColor: '#0ea5e9',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        pointRadius: 0,
                        tension: 0.15,
                        fill: false
                    },
                    {
                        label: '運用なし',
                        data: principal,
                        borderColor: '#64748b',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        borderDash: [4, 4],
                        pointRadius: 0,
                        tension: 0,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { boxWidth: 22, boxHeight: 10, font: { size: 12 } }
                    },
                    tooltip: {
                        callbacks: {
                            label: ctx => ctx.dataset.label + '：' + ctx.parsed.y.toLocaleString() + '万円',
                            afterBody: items => {
                                const pt = series[items[0].dataIndex];
                                if (pt && pt.eventWithdrawal > 0) {
                                    return ['イベント支出：-' + Math.round(pt.eventWithdrawal) + '万円 (' + pt.eventShortLabel + ')'];
                                }
                                return [];
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: '#f1f5f9' },
                        ticks: { maxRotation: 45, minRotation: 45, font: { size: 11 } }
                    },
                    y: {
                        max: yMax,
                        grid: {
                            color: ctx => ctx.tick && ctx.tick.value === 0 ? '#334155' : '#e2e8f0',
                            lineWidth: ctx => ctx.tick && ctx.tick.value === 0 ? 1.5 : 1
                        },
                        ticks: {
                            callback: val => val.toLocaleString() + '万円',
                            font: { size: 11 }
                        }
                    }
                }
            },
            plugins: [eventLabelPlugin]
        });
    }
});
