function(){
	$('.s-form').submit(function(e){
		//отменяем стандартное действие при отправке формы
		if (!e) {e = window.event;};
		e.preventDefault();
		//берем из формы метод передачи данных
		var m_method=$(this).attr('method');
		//получаем адрес скрипта на сервере, куда нужно отправить форму
		var m_action=$(this).attr('action');
		//получаем данные, введенные пользователем в формате input1=value1&input2=value2...,
		//то есть в стандартном формате передачи данных формы
		var m_data=$(this).serialize();
		m_data = m_data + "&locattion=" + window.location.toString();
		$.ajax({
			type: m_method,
			url: m_action,
			data: m_data,
			success: function(result){
				alert('Ваша заявка отправлена');
			}
		});
	});
}