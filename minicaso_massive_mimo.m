% Mini-caso Técnico: Simulación de Beam Sweeping y SNR vs Número de Antenas en Massive MIMO
clear; clc; close all;
%% 1. Parametros del sistema
M_antennas = [16, 32, 64, 128, 256];
Pt_dBm = 30; % Potencia total transmitida
BW = 20e6; % Ancho de banda: 20 MHz
N0_dBm_Hz = -174; % Densidad espectral de ruido
NF = 6; % Figura de ruido del receptor
d = 100; % Distancia en metros
fc = 3.5; % Frecuencia en GHz
%% 2. Modelo de propagacion UMi LOS
PL_d0 = 32.4 + 21*log10(d) + 20*log10(fc);
%% 3. Potencia de ruido
Noise_power_dBm = N0_dBm_Hz + ...
10*log10(BW) + NF;
%% 4. Inicializacion de resultados
Pr_dBm = zeros(size(M_antennas));
Gain_dB = zeros(size(M_antennas));
SNR_dB = zeros(size(M_antennas));
SE = zeros(size(M_antennas));
%% 5. Evaluacion para cada numero de antenas
for i = 1:length(M_antennas)
    M = M_antennas(i);
    % Ganancia ideal del arreglo
    G_tx = M;
    Gain_dB(i) = 10*log10(G_tx);
    % Potencia recibida
    Pr_dBm(i) = Pt_dBm + Gain_dB(i) - PL_d0;
    % Relacion senal-ruido
    SNR_dB(i) = Pr_dBm(i) - Noise_power_dBm;
    % Conversion a escala lineal
    SNR_linear = 10^(SNR_dB(i)/10);
    % Eficiencia espectral teorica
    SE(i) = log2(1 + SNR_linear);
end
%% 6. Mostrar resultados
Results = table(M_antennas', Gain_dB', Pr_dBm', ...
SNR_dB', SE', ...
'VariableNames', {'Antennas','Gain_dB', ...
'ReceivedPower_dBm','SNR_dB','SpectralEfficiency'});
disp(Results);
fprintf('Path Loss: %.2f dB\n', PL_d0);
fprintf('Noise Power: %.2f dBm\n', Noise_power_dBm);
%% 7. Grafica: Numero de antenas vs SNR
figure('Name','Massive MIMO: Antennas vs SNR');
plot(M_antennas, SNR_dB, '-ro', ...
'LineWidth', 2, 'MarkerSize', 8, ...
'MarkerFaceColor', 'r');
grid on;
xlabel('Number of antennas (M)');
ylabel('Received SNR (dB)');
title('Impact of Antenna Scaling on SNR');
%% 8. Grafica: Numero de antenas vs eficiencia espectral
figure('Name','Massive MIMO: Spectral Efficiency');
plot(M_antennas, SE, '-bs', ...
'LineWidth', 2, 'MarkerSize', 8, ...
'MarkerFaceColor', 'b');
grid on;
xlabel('Number of antennas (M)');
ylabel('Spectral Efficiency (bit/s/Hz)');
title('Spectral Efficiency vs Number of Antennas');
%% 9. Grafica: Ganancia del arreglo
figure('Name','Massive MIMO: Array Gain');
plot(M_antennas, Gain_dB, '-k^', ...
'LineWidth', 2, 'MarkerSize', 8, ...
'MarkerFaceColor', 'k');
grid on;
xlabel('Number of antennas (M)');
ylabel('Array Gain (dB)');
title('Ideal Beamforming Array Gain');
