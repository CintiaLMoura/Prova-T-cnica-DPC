$(document).ready(function() {
    $(".clearFields").click(function(){
        $("#cep").val("");
        $("#rua").val("");
        $("#bairro").val("");
        $("#uf").val("");
        $("#complemento").val("");
        $("#ibge").val("");
        $("#estado").val("XX");
        $("#cidade").val("0");
        $("#cidade option").remove(".insertCity");
        $(".panel-found").fadeOut();
        $("table").remove("tr #body-table");
    });

    $("#cep").mask("00000-000");

    function clean_cep() {
                // Limpa valores do formulário de cep.
                $("#rua").val("");
                $("#bairro").val("");
                $("#uf").val("");
                $("#complemento").val("");
                $("#ibge").val("");
                $("#logradouroState").remove("span #helpLogradouro");
                //$("#cidade option").remove(".insertCity");
                $('#cidade').val('0');
                $('#estado').val('XX');
               // $('#estado').val('0');

               $(".panel-found").fadeOut();
               $("table").remove("tr #body-table");



           }

            //Quando o campo cep perde o foco.
            $(".searchAddress").click(function() {

                //Nova variável "cep" somente com dígitos.
                var cep = $('#cep').val().replace(/\D/g, '');
                var cidade = $('#cidade').val();
                var logradouro = $('#rua').val();
                var estado = $('#estado').val();

                $(".panel-found").fadeOut();
                $("table").remove("tr #body-table");

                //Verifica se campo cep possui valor informado.
                if (cep != "") {

                    //Expressão regular para validar o CEP.
                    var validacep = /^[0-9]{8}$/;

                    //Valida o formato do CEP.
                    if(validacep.test(cep)) {

                        //Preenche os campos com "..." enquanto consulta webservice.
                        $("#rua").val("...");
                        $("#bairro").val("...");
                        $("#uf").val("...");
                        $("#ibge").val("...");
                        $("#complemento").val("...");

                        $("#cidade option").remove(".insertCity");

                        //Consulta o webservice viacep.com.br/
                        $.getJSON("https://viacep.com.br/ws/"+ cep +"/json/?callback=?", function(dados) {

                            if (!("erro" in dados)) {
                                //Atualiza os campos com os valores da consulta.
                                $("#rua").val(dados.logradouro);
                                $("#bairro").val(dados.bairro);
                                $("#cidade").append("<option value='"+dados.localidade+"' class='insertCity'>"+dados.localidade+"</option>");
                                $('#cidade').val(dados.localidade);                              
                                $("#ibge").val(dados.ibge);
                                $("#complemento").val(dados.complemento);


                                //$('#estado').find('[value="' + dados.uf + '"]').attr('selected', true);
                                $('#estado').val(dados.uf);

                            } //end if.
                            else {
                                //CEP pesquisado não foi encontrado.
                                clean_cep();
                                alert("CEP não encontrado.");
                                $("#cidade option").remove(".insertCity");
                            }
                        });
                    } //end if.
                    else {
                        //cep é inválido.
                        clean_cep();
                        alert("Formato de CEP inválido.");
                        $("#cidade option").remove(".insertCity");
                    }
                } //end if.
                else {

                   if(logradouro == "" || cidade == 0 || estado == "XX"){

                    $("#cidade option").remove(".insertCity"); 
                }
                $("#logradouroState").remove("span #helpLogradouro");

                if(logradouro == ""){
                    $("#logradouroField").addClass("has-error");
                    $("#logradouroState").append("<span id='helpLogradouro' class='help-block'>Por favor! Inserir o nome da rua ou avenida!</span>");
                    setTimeout(function(){ 
                        $("#helpLogradouro").remove();
                        $("#logradouroField").removeClass("has-error");
                    }, 3000);

                    $("#estado").val("XX");
                    $("#cidade").val("0");

                }else if(cidade == 0){
                    $("#cidadeField").addClass("has-error");
                    $("#cidadeState").append("<span id='helpCidade' class='help-block'>Por favor! Escolha uma cidade depois de selecionar o estado!</span>");
                    setTimeout(function(){ 
                        $("#helpCidade").remove();
                        $("#cidadeField").removeClass("has-error");
                    }, 3000);

                    $("#estado").val("XX");
                    $("#cidade").val("0");
                }
                if(logradouro != "" && cidade != "" && estado != ""){

                        //Consulta o webservice viacep.com.br/
                        $.getJSON("https://viacep.com.br/ws/"+estado+"/"+cidade+"/"+logradouro+"/json", function(dados2) {

                            if (!("erro" in dados2)) {
                                var counter = 0;
                                var items1 = [];
                                $.each(dados2, function(key, val){
                                  
                                 counter++;
                                 
                                 
                                   // $("#cidade").append("<option value='"+val.nome+"' class='insertCity'>"+val.nome+"</option>");
                               });
                                console.log(counter);
                                if(counter <= 1){
                                   $.each(dados2, function(key, val){

                                   //Atualiza os campos com os valores da consulta.
                                   $("#cep").val(val.cep);  
                                   $("#bairro").val(val.bairro);                           
                                   $("#ibge").val(dados2.ibge);
                                   $("#complemento").val(val.complemento);
                                   
                                   // $("#cidade").append("<option value='"+val.nome+"' class='insertCity'>"+val.nome+"</option>");
                               });
                               }else{

                                  $.each(dados2, function(key, val){
                                    $(".panel-found").fadeIn();
                                    $("table").append("<tr id='body-table' style='color: #337ab7;font-weight: normal;'><td>"+val.cep+"</td><td>"+val.logradouro+"</td><td>"+val.complemento+"</td><td>"+val.bairro+"</td><td>"+val.localidade+"</td><td>"+val.uf+"</td></tr>");
                                   //Atualiza os campos com os valores da consulta.
                                   
                               });
                                  

                              }

                          }else{
                           alert("Dados não encontrados.");
                            } //end if.
                            
                        });
                    } //end if

                }
            });

$("#estado").change(function(){

    $("#cep").val("");
    $("#cidade").val("0");
    $("#bairro").val("");
    $("#Número").val("");
    $("#complemento").val("");
    $("#cidade option").remove(".insertCity");

    var selectEstado = $("#estado").val();           
    
      //Consulta o webservice viacep.com.br/
      $.getJSON("https://servicodados.ibge.gov.br/api/v1/localidades/estados/"+selectEstado+"/distritos", function(data) {

        var items = [];
        $.each(data, function(key, val){
            
           $("#cidade").append("<option value='"+val.nome+"' class='insertCity'>"+val.nome+"</option>");
           
       });
    });
      
  });

});