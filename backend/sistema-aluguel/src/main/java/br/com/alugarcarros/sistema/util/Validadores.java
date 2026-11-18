package br.com.alugarcarros.sistema.util;

public final class Validadores {

    private Validadores() {
    }

    public static String somenteDigitos(String valor) {
        return valor == null ? "" : valor.replaceAll("\\D", "");
    }

    public static boolean cpfValido(String cpf) {

        if (cpf == null || !cpf.matches("\\d{11}")) {
            return false;
        }

        // Rejeita CPFs com todos os numeros iguais.
        if (cpf.chars().distinct().count() == 1) {
            return false;
        }

        int soma = 0;

        for (int i = 0; i < 9; i++) {
            soma += Character.getNumericValue(cpf.charAt(i)) * (10 - i);
        }

        int resto = soma % 11;
        int primeiroDigito = resto < 2 ? 0 : 11 - resto;

        if (primeiroDigito != Character.getNumericValue(cpf.charAt(9))) {
            return false;
        }

        soma = 0;

        for (int i = 0; i < 10; i++) {
            soma += Character.getNumericValue(cpf.charAt(i)) * (11 - i);
        }

        resto = soma % 11;
        int segundoDigito = resto < 2 ? 0 : 11 - resto;

        return segundoDigito == Character.getNumericValue(cpf.charAt(10));
    }

    public static boolean cnpjValido(String cnpj) {

        if (cnpj == null || !cnpj.matches("\\d{14}")) {
            return false;
        }

        if (cnpj.chars().distinct().count() == 1) {
            return false;
        }

        int[] pesos1 = {5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};
        int[] pesos2 = {6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};

        int primeiro = digitoCnpj(cnpj, pesos1);
        int segundo = digitoCnpj(cnpj, pesos2);

        return primeiro == Character.getNumericValue(cnpj.charAt(12))
            && segundo == Character.getNumericValue(cnpj.charAt(13));
    }

    private static int digitoCnpj(String cnpj, int[] pesos) {
        int soma = 0;

        for (int i = 0; i < pesos.length; i++) {
            soma += Character.getNumericValue(cnpj.charAt(i)) * pesos[i];
        }

        int resto = soma % 11;

        return resto < 2 ? 0 : 11 - resto;
    }
}
