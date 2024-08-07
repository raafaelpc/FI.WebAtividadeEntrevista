$(document).ready(function () {
    // Máscara para CPF
    $('.cpf').mask('000.000.000-00', { reverse: true });

    // Evento de envio do formulário de cadastro
    $('#formCadastro').submit(function (e) {
        e.preventDefault();

        let cpfCliente = $("#CPF").val().replaceAll('.', '').replaceAll('-', '');

        // Validação de CPF do Cliente
        if (!validarCPF(cpfCliente)) {
            alert("CPF do cliente é inválido!");
            return;
        }

        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $("#Nome").val(),
                "CEP": $("#CEP").val(),
                "CPF": cpfCliente,
                "Email": $("#Email").val(),
                "Sobrenome": $("#Sobrenome").val(),
                "Nacionalidade": $("#Nacionalidade").val(),
                "Estado": $("#Estado").val(),
                "Cidade": $("#Cidade").val(),
                "Logradouro": $("#Logradouro").val(),
                "Telefone": $("#Telefone").val(),
                "Beneficiarios": listarNovosBeneficiariosArrayObjects()
            },
            error: function (r) {
                if (r.status == 400)
                    alert("Erro: " + r.responseJSON);
                else if (r.status == 500)
                    alert("Erro interno do servidor.");
            },
            success: function (r) {
                alert("Cliente cadastrado com sucesso!");
                $("#formCadastro")[0].reset();
            }
        });
    });

    // Evento de envio do formulário de beneficiário
    $('#FormCadastroBeneficiario').submit(function (e) {
        e.preventDefault();
        let acao = $("#btn-incluir").data('acao');
        let beneficiarioNome = $('#BeneficiarioNome').val();
        let beneficiarioCPF = $('#BeneficiarioCPF').val().replaceAll('.', '').replaceAll('-', '');

        // Validação de CPF do Beneficiário
        if (!validarCPF(beneficiarioCPF)) {
            alert("CPF do beneficiário é inválido!");
            return;
        }

        if (acao === 'Incluir') {
            if (!existeMesmoCPFNaLista(beneficiarioCPF)) {
                IncluirBeneficiario(beneficiarioNome, beneficiarioCPF);
                $('#BeneficiarioNome').val('');
                $('#BeneficiarioCPF').val('');
                elementoParaAlterar = null;
            } else {
                alert("Esse CPF já está na lista!");
            }
        } else if (acao === 'Alterar') {
            if (!existeMesmoCPFNaLista(beneficiarioCPF)) {
                AlterarBeneficiario();
                AlternarEvendoDeInclusaoOuAlteracao('Incluir');
                elementoParaAlterar.style.backgroundColor = "#fff";
                $('#BeneficiarioNome').val('');
                $('#BeneficiarioCPF').val('');
                elementoParaAlterar = null;
            } else {
                alert("Esse CPF já está na lista!");
            }
        }
    });

    // Mostrar modal de beneficiários
    $('#btnModalBeneficiarios').on('click', function () {
        if (elementoParaAlterar != null) elementoParaAlterar.style.backgroundColor = "#fff";
        $("#FormularioBeneficiario").modal('show');
    });

    // Eventos para excluir e editar beneficiários
    $('.btnExcluirBeneficiario').off().on('click', function () {
        ExcluirElemento($(this).closest('tr'));
    });

    $('.btnEditarBeneficiario').off().on('click', function () {
        BuscarDadosAlteracaoBeneficiario($(this).closest('tr'));
    });
});

function validarCPF(cpf) {
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }
    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) {
        return false;
    }
    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) {
        return false;
    }
    return true;
}

function IncluirBeneficiario(nome, cpf) {
    cpf = $('.cpf').masked(cpf);
    AdicionarElementoListagem(`<tr><td class="beneficiarioCPF">${cpf}</td><td class="beneficiarioNome">${nome}</td><td><button class="btn btn-primary btnEditarBeneficiario">Alterar</button><button class="btn btn-primary btnExcluirBeneficiario">Excluir</button></td></tr>`);
}

function AdicionarElementoListagem(elemento) {
    if ($('#TabelaBeneficiario tbody tr').length > 0) {
        $('#TabelaBeneficiario tbody tr').first().before(elemento);
    } else {
        $('#TabelaBeneficiario tbody').append(elemento);
    }
    $('.btnExcluirBeneficiario').off().on('click', function () {
        ExcluirElemento($(this).closest('tr'));
    });
    $('.btnEditarBeneficiario').off().on('click', function () {
        BuscarDadosAlteracaoBeneficiario($(this).closest('tr'));
    });
}

function listarNovosBeneficiarios() {
    return $('#TabelaBeneficiario tbody tr').not('[data-id]');
}

function listarNovosBeneficiariosArrayObjects() {
    let elementos = listarNovosBeneficiarios();
    let retorno = [];
    elementos.each(function () {
        retorno.push({
            Nome: $(this).find('.beneficiarioNome').text(),
            CPF: $(this).find('.beneficiarioCPF').text().replaceAll('.', '').replaceAll('-', '')
        });
    });
    return retorno;
}

function listarTodosBeneficiarios() {
    return $('#TabelaBeneficiario tbody tr');
}

function listarTodosBeneficiariosArrayObjects() {
    let elementos = listarTodosBeneficiarios();
    let retorno = [];
    elementos.each(function () {
        retorno.push({
            Nome: $(this).find('.beneficiarioNome').text(),
            CPF: $(this).find('.beneficiarioCPF').text().replaceAll('.', '').replaceAll('-', '')
        });
    });
    return retorno;
}

function existeMesmoCPFNaLista(cpf) {
    if (elementoParaAlterar != null && cpf == $(elementoParaAlterar).find('.beneficiarioCPF').text().replaceAll('.', '').replaceAll('-', '')) return false;
    let lista = listarTodosBeneficiariosArrayObjects();
    return lista.some(el => el.CPF === cpf);
}

function ExcluirElemento(el) {
    RemoverBeneficiarioTabela(el);
}

function RemoverBeneficiarioTabela(el) {
    el.remove();
}

function AlterarBeneficiario() {
    $(elementoParaAlterar).find('.beneficiarioNome').text($('#BeneficiarioNome').val());
    $(elementoParaAlterar).find('.beneficiarioCPF').text($('.cpf').masked($('#BeneficiarioCPF').val()));
}

var elementoParaAlterar = null;

function BuscarDadosAlteracaoBeneficiario(el) {
    elementoParaAlterar = el[0];
    $('#BeneficiarioNome').val($(el).find('.beneficiarioNome').text());
    $('#BeneficiarioCPF').val($(el).find('.beneficiarioCPF').text());
    AlternarEvendoDeInclusaoOuAlteracao('Alterar');
    elementoParaAlterar.style.backgroundColor = "#c8c8fa";
}

function AlternarEvendoDeInclusaoOuAlteracao(acao) {
    $("#btn-incluir").data('acao', acao);
    $("#btn-incluir").text(acao);
}
