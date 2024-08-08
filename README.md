# Função sistemas

## Implementação do CPF do Cliente:

### Na tela de cadastramento/alteração de clientes, incluir um novo campo denominado CPF que permitirá o cadastramento do CPF do cliente.
### Pontos Relevantes:

O novo campo deverá seguir o padrão visual dos demais campos da tela. ✔

O cadastramento do CPF será obrigatório. ✔

Deverá possuir a formatação padrão de CPF (999.999.999-99). ✔

Deverá consistir se o dado informado é um CPF válido (conforme o cálculo padrão de verificação do dígito verificador de CPF). ✔

Não permitir o cadastramento de um CPF já existente no banco de dados, ou seja, não é permitida a existência de um CPF duplicado. ✔

#### Obs: Validação dupla tanto no frontend quanto no backend é essencial. No frontend, a validação não é suficiente por si só, pois pode ser burlada. Portanto, a validação no backend é crucial para garantir a segurança e a integridade dos dados.

## Implementação do Botão Beneficiários:

### Na tela de cadastramento/alteração de clientes, incluir um novo botão denominado “Beneficiários” que permitirá o cadastramento de beneficiários do cliente. O mesmo deverá abrir um pop-up para inclusão do “CPF” e “Nome do beneficiário”. Além disso, deverá existir um grid onde serão exibidos os beneficiários que já foram inclusos. No mesmo grid será possível realizar a manutenção dos beneficiários cadastrados, permitindo a alteração e exclusão dos mesmos.

### Pontos Relevantes:

O novo botão e novos campos deverão seguir o padrão visual dos demais botões e campos da tela.✔

O campo CPF deverá possuir a formatação padrão (999.999.999-99).✔

Deverá consistir se o dado informado é um CPF válido (conforme o cálculo padrão de verificação do dígito verificador de CPF).✔

Não permitir o cadastramento de mais de um beneficiário com o mesmo CPF para o mesmo cliente.✔

O beneficiário deverá ser gravado na base de dados quando for acionado o botão “Salvar” na tela de “Cadastrar Cliente”.✔

## Banco de Dados:

Tabela que deverá armazenar o novo campo de CPF: "CLIENTES". ✔

O novo campo deverá ser nomeado como "CPF". ✔

Tabela que deverá armazenar os dados de beneficiários: "BENEFICIARIOS". ✔

Os novos campos deverão ser nomeados como: "ID", “CPF”, “NOME” e “IDCLIENTE”. ✔


