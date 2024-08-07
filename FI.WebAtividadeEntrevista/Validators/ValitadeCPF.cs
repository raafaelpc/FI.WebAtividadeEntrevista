using FI.AtividadeEntrevista.BLL;
using WebAtividadeEntrevista.Models;

namespace FI.WebAtividadeEntrevista.Validators
{
    public sealed class ValitadeCPF
    {
        public static bool IsValidCPFClient(ClienteModel model)
        {
            BoCliente bo = new BoCliente();

            return bo.ValidateExist(model.CPF, model.Id) || !bo.ValidateCheck(model.CPF);
        }

        public static bool IsValidCPFBeneficiary(BeneficiarioModel model)
        {
            BoBeneficiario boBeneficiario = new BoBeneficiario();

            return boBeneficiario.ValidateExist(model.CPF, model.Id) || !boBeneficiario.ValidateCheck(model.CPF);
        }
    }
}