using FI.AtividadeEntrevista.BLL;
using WebAtividadeEntrevista.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FI.AtividadeEntrevista.DML;
using System.Net;
using System.ComponentModel.DataAnnotations;
using FI.WebAtividadeEntrevista.Validators;

namespace WebAtividadeEntrevista.Controllers
{
    public class ClienteController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Incluir()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Incluir(ClienteModel model)
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
                    // Verifica se existe outro CPF igual e se é valido.
                    if (ValidateCPF.IsValidCPFClient(model))
                    {
                        Response.StatusCode = 400;
                        return Json("CPF inválido ou já cadastrado!!");
                    }

                    model.Id = bo.Incluir(new Cliente()
                    {
                        CEP = model.CEP,
                        CPF = model.CPF,
                        Cidade = model.Cidade,
                        Email = model.Email,
                        Estado = model.Estado,
                        Logradouro = model.Logradouro,
                        Nacionalidade = model.Nacionalidade,
                        Nome = model.Nome,
                        Sobrenome = model.Sobrenome,
                        Telefone = model.Telefone
                    });

                    if (model.Beneficiarios != null && model.Beneficiarios.Any())
                    {
                        foreach (var Beneficiario in model.Beneficiarios)
                        {
                            boBeneficiario.Incluir(new Beneficiario
                            {
                                Nome = Beneficiario.Nome,
                                CPF = Beneficiario.CPF,
                                IdCliente = model.Id
                            });
                        }
                    }
                    return Json("Cadastro efetuado com sucesso");
                }
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return Json("Erro interno no servidor: " + ex.Message);
            }
        }

        [HttpPost]//Retorna as alterações
        public JsonResult Alterar(ClienteModel model)
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

                    if (ValidateCPF.IsValidCPFClient(model))
                    {
                        Response.StatusCode = 400;
                        return Json("CPF inválido ou já cadastrado!!");
                    }

                    bo.Alterar(new Cliente()
                    {
                        Id = model.Id,
                        CEP = model.CEP,
                        CPF = model.CPF,
                        Cidade = model.Cidade,
                        Email = model.Email,
                        Estado = model.Estado,
                        Logradouro = model.Logradouro,
                        Nacionalidade = model.Nacionalidade,
                        Nome = model.Nome,
                        Sobrenome = model.Sobrenome,
                        Telefone = model.Telefone
                    });

                    return Json("Cadastro alterado com sucesso");
                }
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return Json("Erro interno no servidor: " + ex.Message);
            }
        }

        [HttpGet]//Retorna informações na tela
        public ActionResult Alterar(long id)
        {
            try
            {
                BoCliente bo = new BoCliente();
                BoBeneficiario boBeneficiario = new BoBeneficiario();
                Cliente cliente = bo.Consultar(id);
                List<Beneficiario> beneficiarios = boBeneficiario.Pesquisa(id);
                List<BeneficiarioModel> beneficiariosmodel = new List<BeneficiarioModel>();

                foreach (var beneficiario in beneficiarios)
                {
                    beneficiariosmodel.Add(new BeneficiarioModel
                    {
                        Id = beneficiario.Id,
                        Nome = beneficiario.Nome,
                        CPF = beneficiario.CPF,
                        IdCliente = beneficiario.IdCliente
                    });
                }
                Models.ClienteModel model = null;

                if (cliente != null)
                {
                    model = new ClienteModel()
                    {
                        Id = cliente.Id,
                        CEP = cliente.CEP,
                        CPF = cliente.CPF,
                        Cidade = cliente.Cidade,
                        Email = cliente.Email,
                        Estado = cliente.Estado,
                        Logradouro = cliente.Logradouro,
                        Nacionalidade = cliente.Nacionalidade,
                        Nome = cliente.Nome,
                        Sobrenome = cliente.Sobrenome,
                        Telefone = cliente.Telefone,
                        Beneficiarios = beneficiariosmodel
                    };
                }

                return View(model);
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return Json("Erro interno no servidor: " + ex.Message);
            }
        }

        [HttpPost]
        public JsonResult ClienteList(int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
        {
            try
            {
                int qtd = 0;
                string campo = string.Empty;
                string crescente = string.Empty;
                string[] array = jtSorting.Split(' ');

                if (array.Length > 0)
                    campo = array[0];

                if (array.Length > 1)
                    crescente = array[1];

                List<Cliente> clientes = new BoCliente().Pesquisa(jtStartIndex, jtPageSize, campo, crescente.Equals("ASC", StringComparison.InvariantCultureIgnoreCase), out qtd);

                // Return result to jTable
                return Json(new { Result = "OK", Records = clientes, TotalRecordCount = qtd });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }
    }
}
