   
    function openmodal(){ 
         
        reset_form('#loginform');  
        reset_form('#gauthenticate-form');  
        reset_form('#signupform');  
        $("#loginmodal").modal('show');
        $("#myModal").modal('hide');
        $("#forgotmodal").modal('hide');
        loadCaptcha('guest');
        $('#gauthenticate-form').hide();
        $('#loginform').show();

    }
    
    function reset_form(selector){
        $(selector).find('input:text, input:password, input:file, select, textarea').val('');
        $(selector).find('input:radio, input:checkbox').prop('checked',false);
        $(selector +" select option").prop("selected", false);
    }


modal_click_disabled=(...params)=>{

  for (i=0; i<params.length; i++) {
  
         $('#'+params[i]).modal({
         backdrop: 'static',
         keyboard: false,
         show: false
     });
  }


}

    function loadCaptcha(login_type){
        
        $.ajax({
            type: "POST", 
            url: base_url+'welcome/loadCaptcha',
            data: {login_type: login_type},
            success: function(captcha){
                if(login_type == 'guest'){
                    $("#load_login_captcha").html(captcha);
                } else if(login_type == 'signup'){
                    $("#load_signup_captcha").html(captcha);
                }
            }
        });
    }
    
    $(function(){
        $(".signup").click(function(){        
            
            $('.reg_name').val();
            $('.reg_email').val();
            $('.reg_password').val();
            $("#myModal").modal();
            loadCaptcha('signup');
            
        });
    });
    
    $(function(){
        $(".forgotbtn").click(function(){         
            $("#loginmodal").modal('hide');         
        });
    });    
     


    $(document).ready(function (e) {
modal_click_disabled('loginmodal','forgotmodal','myModal');

        $('#signupform').on('submit', (function (e) {
            e.preventDefault();
          
            // ($this).prop('disabled',true);            
            let form = $(this);
             let $this = form.find("button[type=submit]:focus");

            $.ajax({
                url: $(this).attr('action'),
                type: "POST",
                data: new FormData(this),
                dataType: 'json',
                contentType: false,
                cache: false,
                processData: false,
                 beforeSend: function () {
                    $this.button('loading');
                    },
                
                success: function (data) {
                    if (data.status == "fail") {
                        var message = "";
                        $.each(data.error, function (index, value) {
                            message += value;
                        });
                        
                        toastr.error(message);
                        // ($this).prop('disabled',false); 
                        $('#signupformbtn').prop('disabled',false);            
                        $('#signupformbtn').html('Sign Up');
                    } else {
                       
                        window.location.reload(true);
                    }
                     $this.button('reset');
                },
                   error: function (xhr) { // if error occured
    alert("Error");
    $this.button('reset');
    },
    complete: function () {
    $this.button('reset');
    }
            });
        }));
    });
    
    $(document).ready(function (e) {
        $('#loginform').on('submit', (function (e) {
            e.preventDefault();
            let form = $(this);
             let $this = form.find("button[type=submit]:focus");
             $.ajax({
                url: $(this).attr('action'),
                type: "POST",
                data: $(this).serialize(),
                dataType: 'json',
                 beforeSend: function () {
                    $this.button('loading');
                    },
                
                success: function (data) {
                     
                    if (data.status == 0) {
                        var message = "";
                        $.each(data.error, function (index, value) {
                            message += value;
                        });
                        toastr.error(message);
                      
                         
                    }else{
                       if(data.gauthenticate){
                         form.fadeOut(400, function () {
                           form.next('form.gauthenticate-form').fadeIn();
                          });
                       }else{

                         toastr.success(data.message);
                         window.location.replace(data.redirect_url)
                       }
                    } 
                  $this.button('reset');   
                },
                 error: function (xhr) { // if error occured
                        alert("Error");
                        $this.button('reset');
                },
                complete: function () {
                        $this.button('reset');
                }
            });
        }));
    });

        // submit
    $(document).on('submit','.gauthenticate-form',function(e){
    e.preventDefault(); // avoid to execute the actual submit of the form.
    var form = $(this);
    var from1=$('#loginform');
    var url = form.attr('action');
    var submit_btn=$("button[type=submit]",form);
            $.ajax({
            url: $(this).attr('action'),
            type: "POST",
            data: from1.serialize()+ "&" + form.serialize(),
            dataType: 'json',
          
            beforeSend: function () {
                submit_btn.button('loading');
            },
            success: function (response)
            {
              
             if (response.status == 0) {
              
                var message = "";
                        $.each(response.error, function (index, value) {
                            message += value;
                        });
                        toastr.error(message);
          
             } else if (response.status == 1)  {
                toastr.error(response.error.error_message);
             }else if (response.status == 2)  {
           
               window.location.href=response.redirect_to;
             }

             submit_btn.button('reset');

            },
            error: function (xhr) { // if error occured
                alert("Error occured.please try again");
                submit_btn.button('reset');
            },
            complete: function () {
                submit_btn.button('reset');
            }

        });


    });

    
    $(document).ready(function (e) {
        $("#forgotform").on('submit', (function (e) {
            e.preventDefault();
            
          let form = $(this);
             let $this = form.find("button[type=submit]:focus");
            
            $.ajax({
                // url: "<?php echo site_url("course/forgotpassword") ?>",
                url: base_url+'course/forgotpassword',
                type: "POST",
                data: new FormData(this),
                dataType: 'json',
                contentType: false,
                cache: false,
                processData: false,
                 beforeSend: function () {
                    $this.button('loading');
                    },
                
                success: function (res)
                {
                    if (res.status == "0") {
                        var message = "";
                            $.each(res.error, function (index, value) {
        
                                message += value;
                            });
                        toastr.error(message);
                       
                    } else {
                        toastr.success(res.message);
                        // location.reload();
                        $("#forgotmodal").modal('hide');
                    }
                      $this.button('reset');
                },
                error: function (xhr) { // if error occured
    alert("Error");
    $this.button('reset');
    },
    complete: function () {
    $this.button('reset');
    }
            });

        }));
    });

    function addtocart(id)
    {
         $.ajax({
            type:'POST',
            url: base_url+'cart/addcart',
            data:{id: id},
             dataType: 'json',
            success: function (data) {
              if (data.status == "fail") {
                        toastr.error(data.error);
                    } else {
                        toastr.success(data.message);
                        //window.location.reload(true);
                       carddatalist(id);
                    }
            }
        });
    }

    function carddatalist(id)
    {         
        $.ajax({
            type:'POST',
            url: base_url+'cart/carddatalist',
            data:{'id':id},
            dataType:'json',
            success: function (data) {
              
                $('#card_data_list_hide').removeClass('hide');
                $('#card_data_list_show').addClass('hide');              
                $('#card_data_list').html(data.page);         
                $('#card_total_amount').html(data.total_amount);
                $('#item_count_replace').addClass('hide');
                $('#item_count_replace_show').removeClass('hide');                 
                $('#item_count_replace_show').html(data.course_count); 
                $('#total_course').html(data.course_count +' Item'); 
                $('#btn_status_'+id).html(data.added_to_cart);                 
            }
        });
    }


    function addtocartfromcoursedetails(id)
    {
         $.ajax({
            type:'POST',
            url: base_url+'cart/addcart',
            data:{id: id},
             dataType: 'json',
            success: function (data) {
              if (data.status == "fail") {
                        toastr.error(data.error);
                    } else {
                        toastr.success(data.message);
                        window.location.reload(true);
                        // carddatalist(id);
                      
                    }
            }
        });
    }    

    function removecartheader(rowid)
    {        
        $.ajax({
            type:'POST',
            url: base_url+'cart/removecartheader',
            data:{rowid: rowid},
            success: function (data) {               
                window.location.reload(true);
            }
        });
    } 

    function startLesson(coureseID)
    {   
        $.ajax({
            url  : base_url+"course/startlesson",
            type : 'post',
            data : {coureseID:coureseID},
            success : function(response){
                $("#ajaxdata").html(response);
            }
        });   
    }

    function afterprint(courseID)
    {
        $('#ajaxdata').html('');
        $.ajax({
            url  : base_url+"course/startlesson",
            type : 'post',
            data : {coureseID:courseID},
            success : function(response){           
                $('#ajaxdata').html(response);
            }
        });
    }

    function checklogin(checkoutstatus=null)
    {
        
        $("#checkout_status").val(checkoutstatus);        
        var status=0;
        $.ajax({
            url:  base_url+'cart/checklogin',
            type: "POST",
            data: {},
            dataType: 'json',
            contentType: false,
            processData: false,
            success: function (data) {                 
                if (data.status == "fail") {                       
                    toastr.error(data.message);                       
                    $("#loginmodal").modal();                   
                    loadCaptcha('guest');                                   
                } else {
                    return true ;
                }
            },
            error: function () {
            }
        });
    }  

    function checkLoginforcart(checkoutstatus=null)
    {        
        if(checkoutstatus!="")
        {
          $("#checkout_status").val("1");
        }
        $.ajax({
            url: base_url+'cart/checklogin',
            type: "POST",
            data: '',
            dataType: 'json',
            contentType: false,
            cache: false,
            processData: false,
            success: function (data) {                  
                if (data.status == "fail") {
                    toastr.error(data.message);
                    $("#loginmodal").modal('show');                     
                    loadCaptcha('guest');
                } else {

                    checkout();
                }
            },
            error: function () {

            }
        });
    }

    $('.lesson_ID').click(function(){
       var coureseID = $(this).attr('lesson-data');
        $.ajax({
            url: base_url+'cart/checklogin',
            type: "POST",
            data: '',
            dataType: 'json',
            contentType: false,
            cache: false,
            processData: false,
            success: function (data) {                  
                if (data.status == "fail") {
                    $("#checkout_status").val("1");
                    toastr.error(data.message);                     
                    $("#loginmodal").modal('show');
                    loadCaptcha('guest');
                } else {
                    // var coureseID = $(this).attr('lesson-data');
                   
                    sessionStorage.setItem("lesson_id", coureseID);
                    window.location.href= base_url+"user/studentcourse" ;
                }
            },
            error: function () {

            }
        });
    });
  

    function addclass(class_name)
    {    
        $.ajax({
            type:'POST',
            url: base_url+'course/addclass',      
            data:{'class_name':class_name},
            success: function (res) {
                
            }
        });
    }

    $("#search_by_course").click(function(){
        $.ajax({
            type:'POST',
            url: base_url+'course/searchcourse',
            data:{'search_text':$('#search_text').val()},
            success: function (res) {
                $("#resultdiv").html(res);
                $("#pagination").addClass('hide');
            }
        }); 
    });
    
