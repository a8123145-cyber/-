$(function () {
    let lastSimData = null;
    let currentZoom = 'all';
    let chartInstance = null;

    function goToStep(stepNum) {
        $('.step-panel').removeClass('active');
        $('#step-' + stepNum).addClass('active');
        $('.step-pill').removeClass('active');
        $('.step-pill[data-step="' + stepNum + '"]').addClass('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function bindRangeAndNumber(rangeSel, numSel, onUpdate) {
        $(rangeSel).on('input', function () {
            $(numSel).val($(this).val());
            if (onUpdate) onUpdate();
        });
        $(numSel).on('input change', function () {
            $(rangeSel).val($(this).val());
            if (onUpdate) onUpdate();
        });
    }

    function updateAgePreview() {
        const cur = parseInt($('#currentAge').val(), 10) || 22;
        let end = parseInt($('#endAge').val(), 10) || 65;
        if (end <= cur) {
            end = cur + 1;
            $('#endAge').val(end);
            $('#endAgeRange').val(end);
        }
        const yrs = Math.min(45, end - cur);
        $('#yearsLabel').text('（運用期間：' + yrs + '年間）');

        $('.event-card').each(function () {
            const y = parseInt($(this).find('.ev-year').val(), 10) || 0;
            $(this).find('.ev-age-preview').text('(' + (cur + y) + '歳時)');
        });
    }

    bindRangeAndNumber('#currentAgeRange', '#currentAge', updateAgePreview);
    bindRangeAndNumber('#endAgeRange', '#endAge', updateAgePreview);
    bindRangeAndNumber('#initialAmountRange', '#initialAmount');
    bindRangeAndNumber('#monthlyAmountRange', '#monthlyAmount');
    updateAgePreview();

    $('.fund-card').on('click', function () {
        $('.fund-card').removeClass('selected');
        $(this).addClass('selected');
        $(this).find('input[type="radio"]').prop('checked', true);
    });

    $('input[name="q_purpose"], input[name="q_drop"]').on('change', function () {
        const purpose = $('input[name="q_purpose"]:checked').val();
        const drop = $('input[name="q_drop"]:checked').val();
        let text = '';
        if (drop === 'sell' || purpose === 'stable') {
            text = '診断アドバイス：値動きを抑えた安定運用を重視されるため、<strong>バランス（8資産均等型）</strong>が相性の良い選択肢です。';
        } else if (purpose === 'growth' && drop === 'hold') {
            text = '診断アドバイス：長期の積立継続が可能なため、<strong>全世界株式（オルカン）</strong>または<strong>米国株式（S&P500）</strong>による複利効果が期待できます。';
        } else {
            text = '診断アドバイス：ライフイベント資金と資産成長のバランスを取るため、<strong>全世界株式（オルカン）</strong>を中心に検討するのがおすすめです。';
        }
        $('#stanceAdvice').html(text);
    });

    $('.ev-enable').on('change', function () {
        const card = $(this).closest('.event-card');
        const checked = $(this).is(':checked');
        const body = card.find('.event-body');
        body.toggleClass('disabled', !checked);
        body.find('input, button').prop('disabled', !checked);
    });

    $('.ev-year').on('input change', updateAgePreview);

    $('.btn-preset').on('click', function () {
        const targetId = $(this).data('target');
        const val = $(this).data('val');
        $('#' + targetId).val(val);
    });

    $('#toStep2').on('click', () => goToStep(2));
    $('#backToStep1').on('click', () => goToStep(1));
    $('#toStep3').on('click', () => goToStep(3));
    $('#backToStep2').on('click', () => goToStep(2));
    $('#backToStep3').on('click', () => goToStep(3));
    $('#backToStep1From4').on('click', () => goToStep(1));

    $('#runSimulationBtn').on('click', function () {
        const currentAge = parseInt($('#currentAge').val(), 10) || 22;
        const endAge = parseInt($('#endAge').val(), 10) || 65;
        const initialAmountMan = parseFloat($('#initialAmount').val()) || 0;
        const monthlyAmountMan = parseFloat($('#monthlyAmount').val()) || 0;
        const fundId = $('input[name="fundId"]:checked').val() || 'allcountry';

        const eventDefs = [
            { id: 'q19', label: '結婚資金' },
            { id: 'q20', label: '住宅の購入・引っ越し' },
            { id: 'q21_1', label: '教育資金(幼稚園〜高校)' },
            { id: 'q21_2', label: '教育資金(大学進学時)' },
            { id: 'q22', label: 'その他イベント' }
        ];

        const lifeEvents = [];
        eventDefs.forEach(ev => {
            if ($('#ev_' + ev.id + '_enable').is(':checked')) {
                lifeEvents.push({
                    id: ev.id,
                    label: ev.label,
                    yearsFromNow: parseInt($('#ev_' + ev.id + '_year').val(), 10) || 1,
                    amountMan: parseFloat($('#ev_' + ev.id + '_amount').val()) || 0
                });
            }
        });

        const payload = {
            fundId: fundId,
            currentAge: currentAge,
            endAge: endAge,
            initialAmountMan: initialAmountMan,
            monthlyAmountMan: monthlyAmountMan,
            lifeEvents: lifeEvents
        };

        $('#loadingOverlay').removeClass('hidden');

        $.ajax({
            url: '/api/simulate',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(payload),
            success: function (res) {
                $('#loadingOverlay').addClass('hidden');
                lastSimData = res;
                currentZoom = 'all';
                $('.btn-zoom').removeClass('active');
                $('.btn-zoom[data-zoom="all"]').addClass('active');
                renderResult(res, 'all');
                goToStep(4);
            },
            error: function (xhr) {
                $('#loadingOverlay').addClass('hidden');
                alert('シミュレーション実行中にエラーが発生しました。サーバー状態を確認してください。');
                console.error(xhr);
            }
        });
    });

    $('.btn-zoom').on('click', function () {
        if (!lastSimData) return;
        $('.btn-zoom').removeClass('active');
        $(this).addClass('active');
        currentZoom = $(this).data('zoom');
        renderResult(lastSimData, currentZoom);
    });

    function fmtMan(val) {
        return Math.round(val).toLocaleString('ja-JP') + ' 万円';
    }

    function renderResult(data, zoomMode) {
        $('#resFundTitle').text(data.fundName + '｜シミュレーション結果（10,000回試行）');
        $('#resParamSubtitle').text(
            '採用パラメータ（50年比率法補正）：期待収益率 μ̂ = ' + (data.mu * 100).toFixed(3) +
            '% ／ リスク σ̂ = ' + (data.sigma * 100).toFixed(3) + '%'
        );

        $('#sumP50').text(fmtMan(data.finalP50));
        $('#sumBeatRate').text('元本上回り確率：' + data.achievementRate.toFixed(1) + '%');
        $('#sumRange30').text(Math.round(data.finalP30).toLocaleString() + ' 〜 ' + Math.round(data.finalP70).toLocaleString() + ' 万円');
        $('#sumP10').text(fmtMan(data.finalP10));
        $('#sumPrincipal').text(fmtMan(data.finalPrincipal));
        $('#sumWithdrawals').text('ライフイベント支出計：' + Math.round(data.totalWithdrawals).toLocaleString() + ' 万円');

        let series = data.series;
        if (zoomMode !== 'all') {
            const maxYr = parseInt(zoomMode, 10);
            series = data.series.filter(pt => pt.year <= maxYr);
        }

        const labels = series.map(pt => pt.age + '歳 (' + pt.year + '年)');
        const p70Data = series.map(pt => Math.round(pt.p70));
        const p50Data = series.map(pt => Math.round(pt.p50));
        const p30Data = series.map(pt => Math.round(pt.p30));
        const p10Data = series.map(pt => Math.round(pt.p10));
        const cashData = series.map(pt => Math.round(pt.principal));

        if (chartInstance) {
            chartInstance.destroy();
        }

        const ctx = document.getElementById('assetChart').getContext('2d');
        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: '上位30%（好調ケース）',
                        data: p70Data,
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.08)',
                        borderWidth: 2,
                        pointRadius: 2,
                        tension: 0.2,
                        fill: 3
                    },
                    {
                        label: '中央値（50%点）',
                        data: p50Data,
                        borderColor: '#2563eb',
                        backgroundColor: 'transparent',
                        borderWidth: 3,
                        pointRadius: 2.5,
                        tension: 0.2,
                        fill: false
                    },
                    {
                        label: '下位30%（やや控えめ）',
                        data: p30Data,
                        borderColor: '#f59e0b',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        pointRadius: 2,
                        tension: 0.2,
                        fill: false
                    },
                    {
                        label: '下位10%（厳しめの相場）',
                        data: p10Data,
                        borderColor: '#06b6d4',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        pointRadius: 2,
                        tension: 0.2,
                        fill: false
                    },
                    {
                        label: '運用なし（元本・現金積立）',
                        data: cashData,
                        borderColor: '#64748b',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        borderDash: [6, 4],
                        pointRadius: 1.5,
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
                    legend: { position: 'top' },
                    tooltip: {
                        callbacks: {
                            label: function (ctx) {
                                return ctx.dataset.label + ': ' + ctx.parsed.y.toLocaleString() + ' 万円';
                            },
                            afterBody: function (items) {
                                const idx = items[0].dataIndex;
                                const pt = series[idx];
                                if (pt && pt.eventWithdrawal > 0) {
                                    return ['▼ ライフイベント支出: -' + Math.round(pt.eventWithdrawal).toLocaleString() + ' 万円 (' + pt.eventLabels + ')'];
                                }
                                return [];
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function (val) {
                                return val.toLocaleString() + ' 万円';
                            }
                        }
                    }
                }
            }
        });

        const tbody = $('#yearlyTable tbody');
        tbody.empty();
        data.series.forEach(pt => {
            const evText = pt.eventWithdrawal > 0
                ? '-' + Math.round(pt.eventWithdrawal).toLocaleString() + '万円 (' + pt.eventLabels + ')'
                : '-';
            tbody.append(
                '<tr>' +
                '<td>' + pt.year + '年目</td>' +
                '<td>' + pt.age + '歳</td>' +
                '<td>' + Math.round(pt.p70).toLocaleString() + '万円</td>' +
                '<td><strong>' + Math.round(pt.p50).toLocaleString() + '万円</strong></td>' +
                '<td>' + Math.round(pt.p30).toLocaleString() + '万円</td>' +
                '<td>' + Math.round(pt.p10).toLocaleString() + '万円</td>' +
                '<td>' + Math.round(pt.principal).toLocaleString() + '万円</td>' +
                '<td>' + evText + '</td>' +
                '</tr>'
            );
        });
    }
});
