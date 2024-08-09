using FI.AtividadeEntrevista.BLL;
using WebAtividadeEntrevista.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FI.AtividadeEntrevista.DML;
using System.Net;
using FI.WebAtividadeEntrevista.Validators;

namespace WebAtividadeEntrevista.Controllers
{
    public class BeneficiarioController : Controller
    {

        [HttpPost]
        public JsonResult Incluir(BeneficiarioModel model)
        {
            try
            {
                BoCliente bo = new BoCliente();
                BoBeneficiario boBeneficiario = new BoBeneficiario();

                if (!this.ModelState.IsValid)
                {
                    List<string> erros = (from item in ModelState.Values
                                          from error in item.Errors
                                          select error.ErrorMessage).ToList();

                    Response.StatusCode = 400;
                    return Json(string.Join(Environment.NewLine, erros));
                }
                else
                {
                    if (ValidateCPF.IsValidCPFBeneficiary(model))
                    {
                        Response.StatusCode = 400;
                        return Json("CPF inválido ou já cadastrado!!");
                    }

                    model.Id = boBeneficiario.Incluir(new Beneficiario()
                    {
                        Nome = model.Nome,
                        CPF = model.CPF,
                        IdCliente = model.IdCliente
                    });


                    return Json(new { Mensagem = "Cadastro efetuado com sucesso", idNovoRegistro = model.Id });
                }
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return Json("Erro interno no servidor: " + ex.Message);
            }
        }


        [HttpPost]
        public JsonResult Alterar(BeneficiarioModel model)
        {
            try
            {

                BoCliente bo = new BoCliente();
                BoBeneficiario boBeneficiario = new BoBeneficiario();

                if (!this.ModelState.IsValid)
                {
                    List<string> erros = (from item in ModelState.Values
                                          from error in item.Errors
                                          select error.ErrorMessage).ToList();

                    Response.StatusCode = 400;
                    return Json(string.Join(Environment.NewLine, erros));
                }
                else
                {
                    Beneficiario beneficiario = boBeneficiario.Consultar(model.Id);

                    if (beneficiario != null && beneficiario.CPF != model.CPF && ValidateCPF.IsValidCPFBeneficiary(model))
                    {
                            Response.StatusCode = 400;
                            return Json("CPF inválido ou já cadastrado!!");
                    }

                    boBeneficiario.Alterar(new Beneficiario()
                    {
                        Id = model.Id,
                        Nome = model.Nome,
                        CPF = model.CPF,
                        IdCliente = model.IdCliente
                    });


                    return Json(new { Mensagem = "Cadastro alterado com sucesso" });
                }
            }

            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return Json("Erro interno no servidor: " + ex.Message);
            }

        }


        [HttpPost]
        public JsonResult Deletar(long id = 0)
        {
            try
            {

                BoCliente bo = new BoCliente();
                BoBeneficiario boBeneficiario = new BoBeneficiario();


                if (id == 0)
                {
                    Response.StatusCode = 400;
                    return Json("Erro ao receber id do registro a remover");
                }
                else
                {
                    boBeneficiario.Excluir(id);

                    return Json("Cadastro alterado com sucesso");
                }
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return Json("Erro interno no servidor: " + ex.Message);
            }
        }
    }
}