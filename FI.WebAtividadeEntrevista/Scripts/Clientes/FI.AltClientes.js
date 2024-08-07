$(document).ready(function () {
    $('.cpf').mask('000.000.000-00', { reverse: true });

    if (obj) {
        $('#formCadastro #Nome').val(obj.Nome);
        $('#formCadastro #CEP').val(obj.CEP);
        $('#formCadastro #CPF').val($('.cpf').masked(obj.CPF));
        $('#formCadastro #Email').val(obj.Email);
        $('#formCadastro #Sobrenome').val(obj.Sobrenome);
        $('#formCadastro #Nacionalidade').val(obj.Nacionalidade);
        $('#formCadastro #Estado').val(obj.Estado);
        $('#formCadastro #Cidade').val(obj.Cidade);
        $('#formCadastro #Logradouro').val(obj.Logradouro);
        $('#formCadastro #Telefone').val(obj.Telefone);

        if (obj.Beneficiarios) {
            obj.Beneficiarios.forEach(function (beneficiario) {
                let cpf = $('.cpf').masked(beneficiario.CPF);
                $('#TabelaBeneficiario tbody').append(
                    `<tr data-id="${beneficiario.Id}">
                        <td class="beneficiarioCPF">${cpf}</td>
                        <td class="beneficiarioNome">${beneficiario.Nome}</td>
                        <td>
                            <button class="btn btn-primary btnEditarBeneficiario">Alterar</button>
                            <button class="btn btn-primary btnExcluirBeneficiario">Excluir</button>
                        </td>
                    </tr>`
                );
            });
        }
    }

    $('#formCadastro').submit(function (e) {
        e.preventDefault();

        let cpf = $("#CPF").val().replace(/\D/g, '');

        // Validação de CPF do Cliente
        if (!validarCPF(cpf)) {
            alert("CPF do cliente é inválido!");
            return;
        }

        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $("#Nome").val(),
                "CEP": $("#CEP").val(),
                "CPF": cpf,
                "Email": $("#Email").val(),
                "Sobrenome": $("#Sobrenome").val(),
                "Nacionalidade": $("#Nacionalidade").val(),
                "Estado": $("#Estado").val(),
                "Cidade": $("#Cidade").val(),
                "Logradouro": $("#Logradouro").val(),
                "Telefone": $("#Telefone").val()
            },
            error: function (r) {
                if (r.status == 400)
                    alert("Erro: " + r.responseJSON);
                else if (r.status == 500)
                    alert("Erro interno no servidor.");
            },
            success: function (r) {
                alert("Sucesso: " + r);
                $("#formCadastro")[0].reset();
                window.location.href = urlRetorno;
            }
        });
    });

    $('#FormCadastroBeneficiario').submit(function (e) {
        e.preventDefault();
        let acao = $("#btn-incluir").data('acao');
        let beneficiarioNome = $('#BeneficiarioNome').val();
        let beneficiarioCPF = $('#BeneficiarioCPF').val().replace(/\D/g, '');

        // Validação de CPF do Beneficiário
        if (!validarCPF(beneficiarioCPF)) {
            alert("CPF do beneficiário é inválido!");
            return;
        }

        if (acao == 'Incluir') {
            if (!existeMesmoCPFNaLista(beneficiarioCPF)) {
                $.ajax({
                    url: urlIncluir,
                    method: "POST",
                    data: {
                        "IdCliente": obj.Id,
                        "Nome": beneficiarioNome,
                        "CPF": beneficiarioCPF
                    },
                    error: function (r) {
                        if (r.status == 400)
                            alert("Erro: " + r.responseJSON);
                        else if (r.status == 500)
                            alert("Erro interno no servidor.");
                    },
                    success: function (r) {
                        alert("Cadastrado com sucesso!");
                        $('#TabelaBeneficiario tbody').append(
                            `<tr data-id="${r.idNovoRegistro}">
                                <td class="beneficiarioCPF">${$('.cpf').masked(beneficiarioCPF)}</td>
                                <td class="beneficiarioNome">${beneficiarioNome}</td>
                                <td>
                                    <button class="btn btn-primary btnEditarBeneficiario">Alterar</button>
                                    <button class="btn btn-primary btnExcluirBeneficiario">Excluir</button>
                                </td>
                            </tr>`
                        );
                    }
                });
            } else {
                alert("Não é possível cadastrar este CPF, pois ele já está presente na lista.");
            }
        } else if (acao == 'Alterar') {
            // Verifica se o CPF já está presente na lista, mas exclui o próprio elemento da verificação
            if (!existeMesmoCPFNaListaParaAlteracao(beneficiarioCPF, elementoParaAlterar.data('id'))) {
                $.ajax({
                    url: urlAlter,
                    method: "POST",
                    data: {
                        "Id": elementoParaAlterar.data('id'),
                        "IdCliente": obj.Id,
                        "Nome": beneficiarioNome,
                        "CPF": beneficiarioCPF
                    },
                    error: function (r) {
                        if (r.status == 400)
                            alert("Erro: " + r.responseJSON);
                        else if (r.status == 500)
                            alert("Erro interno no servidor.");
                    },
                    success: function (r) {
                        alert("Alterado com sucesso!");
                        elementoParaAlterar.find('.beneficiarioNome').text(beneficiarioNome);
                        elementoParaAlterar.find('.beneficiarioCPF').text($('.cpf').masked(beneficiarioCPF));
                    }
                });
            } else {
                alert("Não é possível cadastrar este CPF, pois ele já está presente na lista.");
            }
        }
    });

    $('#btnModalBeneficiarios').click(function () {
        $("#FormularioBeneficiario").modal('show');
    });

    $(document).on('click', '.btnExcluirBeneficiario', function () {
        let el = $(this).closest('tr');
        $.ajax({
            url: urlDelete,
            method: "POST",
            data: { "id": el.data('id') },
            error: function (r) {
                if (r.status == 400)
                    alert("Erro: " + r.responseJSON);
                else if (r.status == 500)
                    alert("Erro interno no servidor.");
            },
            success: function (r) {
                alert("Sucesso: " + r);
                el.remove();
            }
        });
    });

    $(document).on('click', '.btnEditarBeneficiario', function () {
        let el = $(this).closest('tr');
        $('#BeneficiarioNome').val(el.find('.beneficiarioNome').text());
        $('#BeneficiarioCPF').val(el.find('.beneficiarioCPF').text().replace(/\D/g, ''));
        elementoParaAlterar = el;
        $("#btn-incluir").data('acao', 'Alterar').text('Alterar');
        $("#FormularioBeneficiario").modal('show');
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

function existeMesmoCPFNaLista(cpf) {
    let lista = listarTodosBeneficiariosArrayObjects();
    return lista.some(el => el.CPF == cpf);
}

function existeMesmoCPFNaListaParaAlteracao(cpf, id) {
    let lista = listarTodosBeneficiariosArrayObjects();
    return lista.some(el => el.CPF == cpf && el.Id !== id);
}

function listarTodosBeneficiariosArrayObjects() {
    let retorno = [];
    $('#TabelaBeneficiario tbody tr').each(function () {
        retorno.push({
            Id: $(this).data('id'),
            Nome: $(this).find('.beneficiarioNome').text(),
            CPF: $(this).find('.beneficiarioCPF').text().replace(/\D/g, '')
        });
    });
    return retorno;
}
