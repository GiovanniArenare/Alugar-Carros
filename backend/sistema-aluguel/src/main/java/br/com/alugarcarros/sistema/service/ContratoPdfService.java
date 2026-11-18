
package br.com.alugarcarros.sistema.service;

import br.com.alugarcarros.sistema.model.Cliente;
import br.com.alugarcarros.sistema.model.ContratoAluguel;
import br.com.alugarcarros.sistema.model.ContratoCredito;
import br.com.alugarcarros.sistema.model.Rendimento;
import br.com.alugarcarros.sistema.model.SolicitacaoAluguel;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class ContratoPdfService {

    private static final DateTimeFormatter FORMATO_DATA =
            DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private static String formatarCpf(String cpf) {
        if (cpf == null || cpf.length() != 11) {
            return cpf;
        }

        return cpf.substring(0, 3) + "." + cpf.substring(3, 6) + "."
            + cpf.substring(6, 9) + "-" + cpf.substring(9);
    }

    public byte[] gerarPdf(
            ContratoAluguel contrato,
            Cliente cliente,
            ContratoCredito credito
    ) {

        ByteArrayOutputStream saida = new ByteArrayOutputStream();

        Document documento = new Document(PageSize.A4, 50, 50, 50, 50);

        try {
            PdfWriter.getInstance(documento, saida);
            documento.open();

            Font titulo = FontFactory.getFont(
                    FontFactory.HELVETICA_BOLD, 18, Color.BLACK
            );

            Font subtitulo = FontFactory.getFont(
                    FontFactory.HELVETICA_BOLD, 12, Color.BLACK
            );

            Font texto = FontFactory.getFont(
                    FontFactory.HELVETICA, 11, Color.BLACK
            );

            ContratoAluguel contratoAtual = contrato;
            SolicitacaoAluguel solicitacao = contratoAtual.getSolicitacao();

            documento.add(new Paragraph("CONTRATO DE ALUGUEL DE VEÍCULO", titulo));
            documento.add(new Paragraph(" "));

            documento.add(new Paragraph(
                    "Número do contrato: " + contratoAtual.getId(), texto
            ));

            documento.add(new Paragraph(
                    "Data de emissão: " +
                    contratoAtual.getDataCriacao().format(
                            DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")
                    ), texto
            ));

            documento.add(new Paragraph(" "));
            documento.add(new Paragraph("1. DADOS DO CONTRATANTE", subtitulo));
            documento.add(new Paragraph(
                    "Nome: " + contratoAtual.getNomeContratante(), texto
            ));

            documento.add(new Paragraph(
                    "CPF: " + formatarCpf(cliente.getCpf()), texto
            ));

            documento.add(new Paragraph("RG: " + cliente.getRg(), texto));

            documento.add(new Paragraph(
                    "Endereço: " + cliente.getEndereco().formatado(), texto
            ));

            documento.add(new Paragraph(
                    "Profissão: " + cliente.getProfissao(), texto
            ));

            for (Rendimento rendimento : cliente.getRendimentos()) {
                documento.add(new Paragraph(
                        "Rendimento (" + rendimento.getEntidadeEmpregadora()
                        + "): R$ " + rendimento.getValor(), texto
                ));
            }

            documento.add(new Paragraph(" "));
            documento.add(new Paragraph("2. DADOS DO VEÍCULO", subtitulo));

            documento.add(new Paragraph(
                    "Marca: " + solicitacao.getAutomovel().getMarca(), texto
            ));

            documento.add(new Paragraph(
                    "Modelo: " + solicitacao.getAutomovel().getModelo(), texto
            ));

            documento.add(new Paragraph(
                    "Ano: " + solicitacao.getAutomovel().getAno(), texto
            ));

            documento.add(new Paragraph(
                    "Placa: " + solicitacao.getAutomovel().getPlaca(), texto
            ));

            documento.add(new Paragraph(" "));
            documento.add(new Paragraph("3. PERÍODO DA LOCAÇÃO", subtitulo));

            documento.add(new Paragraph(
                    "Data de início: " +
                    solicitacao.getDataInicio().format(FORMATO_DATA), texto
            ));

            documento.add(new Paragraph(
                    "Data de término: " +
                    solicitacao.getDataFim().format(FORMATO_DATA), texto
            ));

            documento.add(new Paragraph(" "));
            documento.add(new Paragraph("4. DADOS DO CONTRATO", subtitulo));

            if (contratoAtual.getEmpresa() != null) {
                documento.add(new Paragraph(
                        "Empresa locadora: "
                        + contratoAtual.getEmpresa().getRazaoSocial()
                        + " (CNPJ " + contratoAtual.getEmpresa().getCnpj() + ")",
                        texto
                ));
            }

            if (contratoAtual.getValorTotal() != null) {
                documento.add(new Paragraph(
                        "Valor total: R$ " + contratoAtual.getValorTotal(), texto
                ));
            }

            documento.add(new Paragraph(
                    "Renda mensal declarada: R$ "
                    + contratoAtual.getRendaMensal(), texto
            ));

            documento.add(new Paragraph(
                    "Situação: " + contratoAtual.getStatus(), texto
            ));

            documento.add(new Paragraph(" "));
            if (credito != null) {
                documento.add(new Paragraph("5. CONTRATO DE CRÉDITO", subtitulo));

                documento.add(new Paragraph(
                        "Banco: " + credito.getBanco().getNome()
                        + " (código " + credito.getBanco().getCodigo() + ")",
                        texto
                ));

                documento.add(new Paragraph(
                        "Valor financiado: R$ " + credito.getValorFinanciado(),
                        texto
                ));

                documento.add(new Paragraph(
                        "Taxa de juros: " + credito.getTaxaJurosMensal()
                        + "% ao mês", texto
                ));

                documento.add(new Paragraph(
                        credito.getNumeroParcelas() + " parcelas de R$ "
                        + credito.getValorParcela(), texto
                ));

                documento.add(new Paragraph(" "));
            }

            documento.add(new Paragraph(
                    (credito != null ? "6" : "5") + ". DISPOSIÇÕES GERAIS",
                    subtitulo
            ));

            documento.add(new Paragraph(
                    "O presente documento registra os dados da solicitação " +
                    "de aluguel e do contratante. A execução da locação " +
                    "depende da formalização e assinatura do contrato pelas partes.",
                    texto
            ));

            documento.add(new Paragraph(" "));
            documento.add(new Paragraph(" "));

            PdfPTable assinaturas = new PdfPTable(2);
            assinaturas.setWidthPercentage(100);

            PdfPCell assinaturaCliente = new PdfPCell(
                    new Phrase("____________________________\nContratante", texto)
            );

            PdfPCell assinaturaEmpresa = new PdfPCell(
                    new Phrase("____________________________\nResponsável pela locação", texto)
            );

            assinaturaCliente.setBorder(0);
            assinaturaEmpresa.setBorder(0);

            assinaturas.addCell(assinaturaCliente);
            assinaturas.addCell(assinaturaEmpresa);

            documento.add(assinaturas);

        } catch (DocumentException e) {
            throw new RuntimeException("Erro ao gerar contrato PDF.", e);
        } finally {
            documento.close();
        }

        return saida.toByteArray();
    }
}
