<?php 
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Silex\Provider\FormServiceProvider;
use Cocur\Slugify\Slugify;

$config = include_once __DIR__ . '/../config/config.php';

class Application extends Silex\Application
{
    use Silex\Application\SecurityTrait;
}

$app = new Application();

$app['debug'] = $config['debug'];

$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__.'/views',
));
$app->register(new Silex\Provider\UrlGeneratorServiceProvider());
$app->register(new FormServiceProvider());
$app->register(new Silex\Provider\TranslationServiceProvider(), array(
    'translator.messages' => array(),
));
$app->register(new Silex\Provider\DoctrineServiceProvider(), array(
    'db.options' => array(
        'driver' => $config['db']['driver'],
        'host' => $config['db']['host'],
        'dbname' => $config['db']['dbname'],
        'user' => $config['db']['user'],
        'password' => $config['db']['password'],
        'charset' => $config['db']['charset'],
    ),
));

$app['db']->exec('SET NAMES utf8');

$app->register(new Silex\Provider\ValidatorServiceProvider());
$app->register(new Silex\Provider\SecurityServiceProvider(), array(
    'security.firewalls' => array(
        'admin' => array(
            'pattern' => '^/admin',
            'http' => true,
            'users' => array(
                $config['admin']['user'] => array('ROLE_ADMIN', $config['admin']['password']),
            ),
        ),
    ),
));

$app->boot();

/* INDEX */

$app->match('/', function () use ($app) {
    $sql = "SELECT * FROM projects ORDER BY id";
    $projects = $app['db']->fetchAll($sql);
    for ($i = 0; $i < count($projects); $i++){
        $sql = "SELECT * FROM project_id_type WHERE project_id = '".$projects[$i]['id']."'";
        $current_project_types = $app['db']->fetchAll($sql);
        $types_name = '';
        for ($j = 0; $j < count($current_project_types); $j++){
            $sql = "SELECT * FROM project_types WHERE id = '".$current_project_types[$j]['project_type']."'";
            $name = $app['db']->fetchAll($sql);
            $name = $name[0];
            if ($types_name == '') {
                $types_name = $name['name'];
            } else {
                $types_name = $types_name . ', ' . $name['name'];
            }
        }
        $projects[$i]['data_type'] = $types_name;
    }
    
    $sql = "SELECT DISTINCT (project_types.id) id, name, full_name, svg FROM project_types INNER JOIN project_id_type ON project_types.id = project_id_type.project_type ORDER BY project_types.id";
    $project_types = $app['db']->fetchAll($sql);
    
    return $app['twig']->render('index.html.twig', array(
        'projects' => $projects,
        'project_types' => $project_types,
    ));
});

$app->match('/project/exclusive', function () use ($app) {
    /* Выбираем все проекты */
    $sql = "SELECT * FROM projects ORDER BY id";
    $projects = $app['db']->fetchAll($sql);
    for ($i = 0; $i < count($projects); $i++){
        /* Назначаем нужный тип проекта */
        $sql = "SELECT * FROM project_id_type WHERE project_id = '".$projects[$i]['id']."'";
        $project_types = $app['db']->fetchAll($sql);
        for ($j = 0; $j < count($project_types); $j++){
            $sql = "SELECT * FROM project_types WHERE id = '".$project_types[$j]['project_type']."'";
            $projects[$i]['data_type'][$j] = $app['db']->fetchAll($sql);
            $projects[$i]['data_type'][$j] = $projects[$i]['data_type'][$j][0];
        }
    }

    /* Выбираем все типы проектов */
    $sql = "SELECT * FROM project_types";
    $project_types = $app['db']->fetchAll($sql);

    return $app['twig']->render('project_exclusive.html.twig', array(
        'project_types' => $project_types,
        'projects' => $projects,
    ));
});

$app->post('/project/apply', function (Request $request) use ($app) {
    if ($request->isMethod('POST')) {
        $to      = 'info@best-quest.ru';
        $subject = 'Заявка с сайта';

        $headers = 'From: best-quest.ru' . "\r\n" ;
        $headers .= "Reply-To: " . $_POST['email'] . "\r\n";
        $headers .= "Content-type: text/plain; charset=UTF-8" . "\r\n";
        $headers .= "Mime-Version: 1.0" . "\r\n";
        $message = '';

        if (isset($_POST['name'])) $message = $message . "Имя: " . $_POST['name'] . "\r\n";
        if (isset($_POST['email'])) $message = $message . "E-mail: " . $_POST['email'] . "\r\n";
        if (isset($_POST['phone'])) $message = $message . "Телефон: " . $_POST['phone'] . "\r\n";
        if (isset($_POST['date'])) $message = $message . "Дата: " . $_POST['date'] . "\r\n";
        if (isset($_POST['qty'])) $message = $message . "Количество человек: " . $_POST['qty'] . "\r\n";
        if (isset($_POST['descr'])) $message = $message . "Дополнительная информация: " . $_POST['descr'] . "\r\n";
        if (isset($_POST['location'])) $message = $message . "Отправлено со страницы: " . $_POST['location'] . "\r\n";
        if (isset($_POST['task'])) $message = $message . "Цель мероприятия: " . $_POST['task'] . "\r\n";
        if (isset($_POST['work'])) $message = $message . "Сфера деятельности компании: " . $_POST['work'] . "\r\n";
        if (isset($_POST['age'])) $message = $message . "Средний возраст участников: " . $_POST['age'] . "\r\n";
        if (isset($_POST['like'])) $message = $message . "Понравившиеся сценарии прошлых мероприятий: " . $_POST['like'] . "\r\n";
        if (isset($_POST['dislike'])) $message = $message . "Мероприятия, концепции которых вам не понравились: " . $_POST['dislike'] . "\r\n";
        if (isset($_POST['ideas'])) $message = $message . "Пожелания и идеи: " . $_POST['ideas'] . "\r\n";

        mail($to, $subject, $message, $headers);
    }
    return new Response();
});

$app->match('/project/{slug}', function ($slug) use ($app) {
    
    /* Выбираем все проекты */
    $sql = "SELECT * FROM projects ORDER BY id";
    $projects = $app['db']->fetchAll($sql);
    for ($i = 0; $i < count($projects); $i++){
        /* Назначаем нужный тип проекта */
        $sql = "SELECT * FROM project_id_type WHERE project_id = '".$projects[$i]['id']."'";
        $project_types = $app['db']->fetchAll($sql);
        for ($j = 0; $j < count($project_types); $j++){
            $sql = "SELECT * FROM project_types WHERE id = '".$project_types[$j]['project_type']."'";
            $projects[$i]['data_type'][$j] = $app['db']->fetchAll($sql);
            $projects[$i]['data_type'][$j] = $projects[$i]['data_type'][$j][0];
        }
        /* Выбраем нужный проект */
        if ($projects[$i]['slug'] == $slug) {
            $project = $projects[$i];
            $id = $project['id'];
        }
    }
    
    /* Выбираем все типы проектов */
    $sql = "SELECT * FROM project_types";
    $project_types = $app['db']->fetchAll($sql);
    
    /* Выбираем все иконки для проекта */
    $sql = "SELECT * FROM icons";
    $icons = $app['db']->fetchAll($sql);
    for ($i = 0; $i < count($icons); $i++){
        $icons[$i]['text'] = $project['icon_'.$icons[$i]['name']];
    }
    
    /* Выбираем бриф проекта */
    $sql = "SELECT * FROM regulations WHERE project_id = '".$id."' ORDER BY id";
    $regulations = $app['db']->fetchAll($sql);
    
    /* Выбираем фотографии проекта */
    $sql = "SELECT * FROM project_photo WHERE project_id = '".$id."' ORDER BY id";
    $photos = $app['db']->fetchAll($sql);
    
    /* Выбираем отзывы проекта */
    $sql = "SELECT * FROM project_review WHERE project_id = '".$id."' ORDER BY id";
    $reviews = $app['db']->fetchAll($sql);
    for ($i = 0; $i < count($reviews); $i++){
        $reviews[$i]['review_text'] = nl2br($reviews[$i]['review_text']);
    }
    
    /* Код цвета в rgb */
    $project['rgba'] = str_split(substr($project['color'], 1), 2);
    foreach($project['rgba'] as $key => $value)
        $project['rgba'][$key] = hexdec($value);
        
    
    return $app['twig']->render('project.html.twig', array(
        'project_types' => $project_types,
        'projects' => $projects,
        'project' => $project,
        'icons' => $icons,
        'regulations' => $regulations,
        'photos' => $photos,
        'reviews' => $reviews,
    ));
});

$app->match('/about', function () use ($app) {
    $sql = "SELECT * FROM about_text WHERE text_column = 'left'";
    $left_text = $app['db']->fetchAll($sql);
    $sql = "SELECT * FROM about_text WHERE text_column = 'right'";
    $right_text = $app['db']->fetchAll($sql);
    $sql = "SELECT * FROM about_team";
    $about_team = $app['db']->fetchAll($sql);
    $sql = "SELECT * FROM about_partners";
    $about_partners = $app['db']->fetchAll($sql);
    for ($i = 0; $i<count($about_partners); $i++){
        $about_partners[$i]['size'] = getimagesize(__DIR__.'/../web/img/about/partners/'.$about_partners[$i]['img']);
    }
    $sql = "SELECT * FROM about_page";
    $color['hex'] = $app['db']->fetchAll($sql);
    $color['hex'] = $color['hex'][0]['color'];
    /* Код цвета в rgb */
    $color['rgb'] = str_split(substr($color['hex'], 1), 2);
    foreach($color['rgb'] as $key => $value)
        $color['rgb'][$key] = hexdec($value);
    
    return $app['twig']->render('about.html.twig', array(
        'left_text' => $left_text,
        'right_text' => $right_text,
        'about_team' => $about_team,
        'about_partners' => $about_partners,
        'color' => $color,
    ));
});

/* АДМИНКА */

$app->match('/admin', function () use ($app) {
    return $app->redirect('/admin/projects');
});

/* РАЗДЕЛЫ */

$app->match('/admin/projects', function () use ($app) {
    $sql = "SELECT * FROM projects";
    $projects = $app['db']->fetchAll($sql);

    return $app['twig']->render('admin/projects.html.twig', array(
        'projects' => $projects,
    ));
});

$app->match('/admin/project-types', function () use ($app) {
    $sql = "SELECT * FROM project_types";
    $project_types = $app['db']->fetchAll($sql);

    return $app['twig']->render('admin/project_types.html.twig', array(
        'project_types' => $project_types,
    ));
});

$app->match('/admin/reviews', function () use ($app) {
    $sql = "SELECT * FROM project_review";
    $reviews = $app['db']->fetchAll($sql);

    return $app['twig']->render('admin/reviews.html.twig', array(
        'reviews' => $reviews,
        'project_types' => $project_types,
    ));
});

$app->match('/admin/pages', function () use ($app) {
    return $app['twig']->render('admin/pages.html.twig', array());
});

/* ПРОЕКТЫ */

$app->match('/admin/project/add', function (Request $request) use ($app) {
    /* Выбираем все типы проектов */
    $sql = "SELECT * FROM project_types";
    $project_types = $app['db']->fetchAll($sql);
    $selects = array();
    for ($i=0; $i<count($project_types); $i++){
        $selects[$project_types[$i]['id']] = $project_types[$i]['full_name'];
    }
    $collections['regulation_headers'] = array();
    $collections['regulation_texts'] = array();
    $form = $app['form.factory']
        ->createBuilder('form', $collections)
        ->add('name','text', array(
            'required' => true,
            'label' => 'Название проекта',
        ))
        ->add('slug','text', array(
            'required' => true,
            'label' => 'slug',
        ))
        ->add('is_in_slider', 'checkbox', array(
            'required' => false,
            'label' => 'В главном слайдере',
            'data' => (boolean) $selected_project['is_in_slider'],
        ))
        ->add('project_type', 'choice', array(
            'choices' => $selects,
            'expanded' => true,
            'multiple' => true,
            'label' => 'Тип проекта',
        ))
        ->add('short_description','text', array(
            'required' => true,
            'label' => 'Короткое описание слайдер',
        ))
        ->add('long_description','text', array(
            'required' => true,
            'label' => 'Длинное описание слайдер',
        ))
        ->add('big_image', 'file', array(
            'label' => 'Большое изображение слайдер',
            'required' => true,
        ))
        ->add('small_image', 'file', array(
            'label' => 'Маленькое изображение слайдер',
            'required' => true,
        ))
        ->add('icon_type','text', array(
            'required' => true,
            'label' => 'Иконка type',
        ))
        ->add('icon_people','text', array(
            'required' => true,
            'label' => 'Иконка people',
        ))
        ->add('icon_house','text', array(
            'required' => true,
            'label' => 'Иконка house',
        ))
        ->add('icon_car','text', array(
            'required' => true,
            'label' => 'Иконка car',
        ))
        ->add('icon_clock','text', array(
            'required' => true,
            'label' => 'Иконка clock',
        ))
        ->add('icon_phone','text', array(
            'required' => true,
            'label' => 'Иконка phone',
        ))
        ->add('icon_age','text', array(
            'required' => true,
            'label' => 'Иконка age',
        ))
        ->add('full_description','textarea', array(
            'required' => true,
            'label' => 'Полное описание',
        ))
        ->add('regulation_headers','collection', array(
            'required' => true,
            'label' => 'Заголовок регламента',
            'allow_add' => true,
            'allow_delete' => true,
            'attr' => array( 
                'data-name' => 'regulation_headers',
            ),
            'options' => array(
                'label' => false,
            ),
        ))
        ->add('regulation_texts','collection', array(
            'required' => true,
            'label' => 'Текст регламента',
            'allow_add' => true,
            'allow_delete' => true,
            'attr' => array( 
                'data-name' => 'regulation_texts',
            ),
            'options' => array(
                'label' => false,
            ),
        ))
        ->add('photos', 'file', array(
            'label' => 'Фотографии',
            'attr' => array(
                'multiple' => true,
            ),
        ))
        ->add('color','text', array(
            'required' => true,
            'label' => 'Цвет оформления',
            'attr' => array(
                    'placeholder' => '#000000',
                ),
        ))
        ->add('bg_top', 'file', array(
            'label' => 'Фоновая картинка верх',
            'required' => true,
        ))
        ->add('bg_descr', 'file', array(
            'label' => 'Фоновая картинка описание',
            'required' => true,
        ))
        ->add('bg_narrow', 'file', array(
            'label' => 'Фоновая картинка полоска',
            'required' => true,
        ))
        ->add('bg_apply', 'file', array(
            'label' => 'Фоновая картинка форма',
            'required' => true,
        ))
        ->getForm();

    $form->handleRequest($request);

    if ($form->isValid()) {
        $data = $form->getData();
        
        /* Файлы */
        $files = $request->files->get($form->getName());

        $slugify = new Slugify();
        $data['slug'] = $slugify->slugify($data['name']);
        
        /* Вставка в projects */
        $sql = "INSERT INTO projects (name, short_description, long_description, icon_type, icon_people, icon_house, icon_car, icon_clock, icon_phone, icon_age, full_description, color, is_in_slider, slug)
            VALUES(
            '".$data['name']."',
            '".$data['short_description']."',
            '".$data['long_description']."',
            '".$data['icon_type']."',
            '".$data['icon_people']."',
            '".$data['icon_house']."',
            '".$data['icon_car']."',
            '".$data['icon_clock']."',
            '".$data['icon_phone']."',
            '".$data['icon_age']."',
            '".$data['full_description']."',
            '".$data['color']."',
            '".$data['is_in_slider']."',
            '".$data['slug']."'
            )";
        $app['db']->exec($sql);
        
        /* Узнаем id добавленного проекта */
        $sql = "SELECT * FROM projects WHERE name = '".$data['name']."'";
        $added_project_id = $app['db']->fetchAll($sql);
        $added_project_id = $added_project_id[0];
        $added_project_id = $added_project_id['id'];
        
        /* Вставка в project_id_type */
        for ($i=0; $i<count($data['project_type']); $i++){
            $sql = "INSERT INTO project_id_type (project_id, project_type) VALUES('".$added_project_id."','".$data['project_type'][$i]."')";
            $app['db']->exec($sql);
        }
        
        /* Регламент */
        if ( isset($data['regulation_headers']) ){
            for ($i=0; $i<count($data['regulation_headers']); $i++){
                $sql = "INSERT INTO regulations (project_id, header, text) VALUES('".$added_project_id."','".$data['regulation_headers'][$i]."','".$data['regulation_texts'][$i]."')";
                $app['db']->exec($sql);
            }
        }
        
        /* Добавление картинок слайдера */
        $path = __DIR__.'/../web/project_files/'.$added_project_id.'/slider/';
        $files['big_image']->move($path, 'big_slider_image.jpg');
        $files['small_image']->move($path,'small_slider_image.jpg');
        /* Добавление фотографий */
        $path = __DIR__.'/../web/project_files/'.$added_project_id.'/photos/';
        for ($i=0; $i<count($files['photos']); $i++){
            $filename = $files['photos'][$i]->getClientOriginalName();
            $files['photos'][$i]->move($path,$filename);
            $sql = "INSERT INTO project_photo (project_id, image) VALUES('".$added_project_id."','".$filename."')";
            $app['db']->exec($sql);
        }
        /* Добавление фоновых картинок */
        $path = __DIR__.'/../web/project_files/'.$added_project_id.'/bgs/';
        $files['bg_top']->move($path,'bg-top.jpg');
        $files['bg_descr']->move($path,'bg-descr.jpg');
        $files['bg_narrow']->move($path,'bg-narrow.jpg');
        $files['bg_apply']->move($path,'bg-apply.jpg');

        /* Выкинуть на главную */
        $response = new RedirectResponse("/admin/projects");
        $response->prepare($request);
        return $response->send();
    }
    
    return $app['twig']->render('admin/project_add.html.twig', array(
        'form' => $form->createView(),
    ));
});

$app->match('/admin/project/edit/{id}', function ($id,Request $request) use ($app) {
    /* Выбираем все типы проектов */
    $sql = "SELECT * FROM project_types";
    $project_types = $app['db']->fetchAll($sql);
    $selects = array();
    for ($i=0; $i<count($project_types); $i++){
        $selects[$project_types[$i]['id']] = $project_types[$i]['full_name'];
    }
    $collections['regulation_headers'] = array();
    $collections['regulation_texts'] = array();
    
    /* Выбираем нужный проект */
    $sql = "SELECT * FROM projects WHERE id='".$id."'";
    $selected_project = $app['db']->fetchAll($sql);
    $selected_project = $selected_project[0];
    
    /* Выбираем тип проекта */
    $sql = "SELECT * FROM project_id_type WHERE project_id='".$id."'";
    $selected_project_type = $app['db']->fetchAll($sql);
    for ($i=0; $i<count($selected_project_type); $i++){
        $selected_project['type'][$i] = $selected_project_type[$i]['project_type'];
    }

    /* Выбираем фотографии */
    $sql = "SELECT * FROM project_photo WHERE project_id='".$id."'";
    $selected_project['photo'] = $app['db']->fetchAll($sql);
    for ($i=0; $i<count($selected_project['photo']); $i++){
        $collections['photos'][$i] = "/project_files/".$id."/photos/".$selected_project['photo'][$i]['image'];
    }
    
    /* Выбираем регламент */
    $sql = "SELECT * FROM regulations WHERE project_id='".$id."'";
    $selected_project['regulation'] = $app['db']->fetchAll($sql);
    for ($i=0; $i<count($selected_project['regulation']); $i++){
        $collections['regulation_headers'][$i] = $selected_project['regulation'][$i]['header'];
        $collections['regulation_texts'][$i] = $selected_project['regulation'][$i]['text'];
    }
    $form = $app['form.factory']
        ->createBuilder('form', $collections)
        ->add('name','text', array(
            'required' => true,
            'label' => 'Название проекта',
            'attr' => array(
                'value' => $selected_project['name'],
            ),
        ))
        ->add('slug','text', array(
            'required' => true,
            'label' => 'slug',
            'attr' => array(
                'value' => $selected_project['slug'],
            ),
        ))
        ->add('is_in_slider', 'checkbox', array(
            'required' => false,
            'label' => 'В главном слайдере',
            'data' => (boolean) $selected_project['is_in_slider'],
        ))
        ->add('project_type', 'choice', array(
            'choices' => $selects,
            'expanded' => true,
            'multiple' => true,
            'label' => 'Тип проекта',
            'data' => $selected_project['type'],
        ))
        ->add('short_description','text', array(
            'required' => true,
            'label' => 'Короткое описание слайдер',
            'attr' => array(
                'value' => $selected_project['short_description'],
            ),
        ))
        ->add('long_description','text', array(
            'required' => true,
            'label' => 'Длинное описание слайдер',
            'attr' => array(
                'value' => $selected_project['long_description'],
            ),
        ))
        ->add('big_image', 'file', array(
            'label' => 'Большое изображение слайдер',
            'required' => false,
        ))
        ->add('small_image', 'file', array(
            'label' => 'Маленькое изображение слайдер',
            'required' => false,
        ))
        ->add('icon_type','text', array(
            'required' => true,
            'label' => 'Иконка type',
            'attr' => array(
                'value' => $selected_project['icon_type'],
            ),
        ))
        ->add('icon_people','text', array(
            'required' => true,
            'label' => 'Иконка people',
            'attr' => array(
                'value' => $selected_project['icon_people'],
            ),
        ))
        ->add('icon_house','text', array(
            'required' => true,
            'label' => 'Иконка house',
            'attr' => array(
                'value' => $selected_project['icon_house'],
            ),
        ))
        ->add('icon_car','text', array(
            'required' => true,
            'label' => 'Иконка car',
            'attr' => array(
                'value' => $selected_project['icon_car'],
            ),
        ))
        ->add('icon_clock','text', array(
            'required' => true,
            'label' => 'Иконка clock',
            'attr' => array(
                'value' => $selected_project['icon_clock'],
            ),
        ))
        ->add('icon_phone','text', array(
            'required' => true,
            'label' => 'Иконка phone',
            'attr' => array(
                'value' => $selected_project['icon_phone'],
            ),
        ))
        ->add('icon_age','text', array(
            'required' => true,
            'label' => 'Иконка age',
            'attr' => array(
                'value' => $selected_project['icon_age'],
            ),
        ))
        ->add('full_description','textarea', array(
            'required' => true,
            'label' => 'Полное описание',
            'data' => $selected_project['full_description'],
        ))
        ->add('regulation_headers','collection', array(
            'required' => true,
            'label' => 'Заголовок регламента',
            'allow_add' => true,
            'allow_delete' => true,
            'attr' => array( 
                'data-name' => 'regulation_headers',
            ),
            'options' => array(
                'label' => false,
            ),
        ))
        ->add('regulation_texts','collection', array(
            'required' => true,
            'label' => 'Текст регламента',
            'allow_add' => true,
            'allow_delete' => true,
            'attr' => array( 
                'data-name' => 'regulation_texts',
            ),
            'options' => array(
                'label' => false,
            ),
        ))
        ->add('photos', 'collection', array(
            'required' => false,
            'label' => 'Фотографии',
            'allow_delete' => true,
        ))
        ->add('add_photos', 'file', array(
            'label' => 'Добавить фотографии',
            'attr' => array(
                'multiple' => true,
            ),
            'required' => false,
        ))
        ->add('color','text', array(
            'required' => true,
            'label' => 'Цвет оформления',
            'attr' => array(
                'value' => $selected_project['color'],
            ),
        ))
        ->add('bg_top', 'file', array(
            'label' => 'Фоновая картинка верх',
            'required' => false,
        ))
        ->add('bg_descr', 'file', array(
            'label' => 'Фоновая картинка описание',
            'required' => false,
        ))
        ->add('bg_narrow', 'file', array(
            'label' => 'Фоновая картинка полоска',
            'required' => false,
        ))
        ->add('bg_apply', 'file', array(
            'label' => 'Фоновая картинка форма',
            'required' => false,
        ))
        ->getForm();

    $form->handleRequest($request);

    if ($form->isValid()) {
        $data = $form->getData();
        
        /* Файлы */
        $files = $request->files->get($form->getName());

        $slugify = new Slugify();
        $data['slug'] = $slugify->slugify($data['name']);

        /* Вставка в projects */
        $sql = "UPDATE projects SET 
            name = '".$data['name']."',
            short_description = '".$data['short_description']."',
            long_description = '".$data['long_description']."',
            icon_type = '".$data['icon_type']."',
            icon_people = '".$data['icon_people']."',
            icon_house = '".$data['icon_house']."',
            icon_car = '".$data['icon_car']."',
            icon_clock = '".$data['icon_clock']."',
            icon_phone = '".$data['icon_phone']."',
            icon_age = '".$data['icon_age']."',
            full_description = '".$data['full_description']."',
            color = '".$data['color']."',
            is_in_slider = '".$data['is_in_slider']."',
            slug = '".$data['slug']."'
            WHERE id = '".$id."'";
        
        $app['db']->exec($sql);
        
        /* Вставка в project_id_type*/
        if(count($data['project_type']) < count($selected_project_type)){
            for ( $i=0; $i<count($data['project_type']); $i++){
                $sql = "UPDATE project_id_type SET 
                    project_type = '".$data['project_type'][$i]."'
                    WHERE id = '".$selected_project_type[$i]['id']."'";
                $app['db']->exec($sql);
            }
            for ( $i; $i<count($selected_project_type); $i++){
                $sql = "DELETE FROM project_id_type WHERE id='".$selected_project_type[$i]['id']."'";
                $app['db']->exec($sql);
            }
        }else {
            for ( $i=0; $i<count($selected_project_type); $i++){
                $sql = "UPDATE project_id_type SET 
                    project_type = '".$data['project_type'][$i]."'
                    WHERE id = '".$selected_project_type[$i]['id']."'";
                $app['db']->exec($sql);
            }
            for ( $i; $i<count($data['project_type']); $i++){
                $sql = "INSERT INTO project_id_type (project_id, project_type) 
                    VALUES('".$id."','".$data['project_type'][$i]."')";
                $app['db']->exec($sql);
            }
        }            
        
        /* Регламент */
        /* Если не пришло регламента, а он был в базе, то удаляем его */
        if (isset($data['regulation_headers'])){
            /* Если регламента пришло меньше, чем было */
            /* Заменяем то количество записей, сколько пришло, остальные удаляем */
            if(count($data['regulation_headers']) < count($selected_project['regulation'])){
                for ( $i=0; $i<count($data['regulation_headers']); $i++){
                    $sql = "UPDATE regulations SET 
                        header = '".$data['regulation_headers'][$i]."',
                        text = '".$data['regulation_texts'][$i]."'
                        WHERE id = '".$selected_project['regulation'][$i]['id']."'";
                    $app['db']->exec($sql);
                }
                for ( $i; $i<count($selected_project['regulation']); $i++){
                    $sql = "DELETE FROM regulations WHERE id='".$selected_project['regulation'][$i]['id']."'";
                    $app['db']->exec($sql);
                }
            } else {
            /* Если регламента пришло больше или столько же как и было */
            /* Заменяем все записи и добавляем новые */
                for ( $i=0; $i<count($selected_project['regulation']); $i++){
                    $sql = "UPDATE regulations SET 
                        header = '".$data['regulation_headers'][$i]."',
                        text = '".$data['regulation_texts'][$i]."'
                        WHERE id = '".$selected_project['regulation'][$i]['id']."'";
                    $app['db']->exec($sql);
                }
                for ( $i; $i<count($data['regulation_headers']); $i++){
                    $sql = "INSERT INTO regulations (project_id, header, text) 
                        VALUES('".$id."','".$data['regulation_headers'][$i]."','".$data['regulation_texts'][$i]."')";
                    $app['db']->exec($sql);
                }
            }
        } elseif (count($selected_project['regulation']) != 0) {
            $sql = "DELETE FROM regulations WHERE project_id='".$id."'";
            $app['db']->exec($sql);
        }
        
        /* Добавление картинок слайдера */
        $path = __DIR__.'/../web/project_files/'.$id.'/slider/';
        if ($files['big_image']){
            $files['big_image']->move($path, 'big_slider_image.jpg');
        }
        if ($files['small_image']){
            $files['small_image']->move($path, 'small_slider_image.jpg');
        }
        
        /* Фотографии */
        /* Если пришло меньше фотографий, чем было, то удаляем эти фотографии из базы и удаляем файлы */
        if (count($selected_project['photo']) > count($data['photos'])){
            for ($j=0; $j<count($data['photos']); $j++){
                $data['photos'][$j] = str_replace("/project_files/".$id."/photos/", "", $data['photos'][$j]);
            }
            for ($i=0; $i<count($selected_project['photo']); $i++){
                $deleted = true;
                for ($j=0; $j<count($data['photos']); $j++){
                    if ($selected_project['photo'][$i]['image'] == $data['photos'][$j]){
                        $deleted = false;
                        break;    
                    }
                }
                if ($deleted == true){
                    unlink(__DIR__.'/../web/project_files/'.$id.'/photos/'.$selected_project['photo'][$i]['image']);
                    $sql = "DELETE FROM project_photo WHERE id='".$selected_project['photo'][$i]['id']."'";
                    $app['db']->exec($sql);
                }
            }
        }

        /* Если загружены еще фотографии, то добавляем их */
        if ($files['add_photos'] && !empty($files['add_photos'][0])){
            $path = __DIR__.'/../web/project_files/'.$id.'/photos/';
            for ($i=0; $i<count($files['add_photos']); $i++){
                $filename = $files['add_photos'][$i]->getClientOriginalName();
                if (file_exists($path . $filename)){
                    $salt = 0;
                    while (file_exists($path . substr($filename,0,-4) . '_' . $salt . substr($filename,-4))){
                        $salt++;
                    }
                    $filename = substr($filename,0,-4) . '_' . $salt . substr($filename,-4);
                }
                $files['add_photos'][$i]->move($path,$filename);
                $sql = "INSERT INTO project_photo (project_id, image) VALUES('".$id."','".$filename."')";
                $app['db']->exec($sql);
            }
        }
        
        /* Добавление фоновых картинок */
        $path = __DIR__.'/../web/project_files/'.$id.'/bgs/';
        if ($files['bg_top']){
            $files['bg_top']->move($path, 'bg-top.jpg');
        }
        if ($files['bg_descr']){
            $files['bg_descr']->move($path, 'bg-descr.jpg');
        }
        if ($files['bg_narrow']){
            $files['bg_narrow']->move($path, 'bg-narrow.jpg');
        }
        if ($files['bg_apply']){
            $files['bg_apply']->move($path, 'bg-apply.jpg');
        }
        
        /* Выкинуть на главную */
        $response = new RedirectResponse("/admin/projects");
        $response->prepare($request);
        return $response->send();
    }
    return $app['twig']->render('admin/project_edit.html.twig', array(
        'form' => $form->createView(),
        'selected_project' => $selected_project,
    ));
});

$app->match('/admin/project/delete/{id}', function ($id,Request $request) use ($app) {
    $sql = "DELETE FROM projects WHERE id='".$id."'";
    $app['db']->exec($sql);
    $sql = "DELETE FROM project_id_type WHERE project_id='".$id."'";
    $app['db']->exec($sql);
    $sql = "DELETE FROM project_photo WHERE project_id='".$id."'";
    $app['db']->exec($sql);
    $sql = "DELETE FROM project_review WHERE project_id='".$id."'";
    $app['db']->exec($sql);
    $sql = "DELETE FROM regulations WHERE project_id='".$id."'";
    $app['db']->exec($sql);
    
    function removeDirectory($dir) {
        if ($objs = glob($dir."/*")) {
            foreach($objs as $obj) {
                is_dir($obj) ? removeDirectory($obj) : unlink($obj);
            }
        }
        rmdir($dir);
    }
    $path = __DIR__.'/../web/project_files/'.$id;
    removeDirectory($path);
    
    /* Выкинуть на главную */
    $response = new RedirectResponse("/admin/projects");
    $response->prepare($request);
    return $response->send();
});

/* КАТЕГОРИИ ПРОЕКТОВ */

$app->match('/admin/project-type/add', function (Request $request) use ($app) {
    $form = $app['form.factory']
        ->createBuilder('form')
        ->add('name', 'text', array(
            'required' => true,
            'label' => 'Краткий идентификатор',
            'attr' => array(
                'placeholder' => 'newcat',
            ),
        ))
        ->add('full_name', 'text', array(
            'required' => true,
            'label' => 'Название категории',
            'attr' => array(
                'placeholder' => 'Новая категория',
            ),
        ))
        ->add('svg', 'textarea', array(
            'required' => true,
            'label' => 'Код svg иконки',
            'attr' => array(
                'placeholder' => '<svg width="56px" height="56px" viewBox="0 0 56 56" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"></svg>',
            ),
        ))
        ->getForm();

    $form->handleRequest($request);

    if ($form->isValid()) {
        $data = $form->getData();

        /* Вставка в project_types */
        $sql = "INSERT INTO project_types (name, full_name, svg) VALUES (
            '" . $data['name'] . "',
            '" . $data['full_name'] . "',
            '" . $data['svg'] . "'
            )";
        $app['db']->exec($sql);

        /* Выкинуть на главную */
        $response = new RedirectResponse("/admin/project-types");
        $response->prepare($request);
        return $response->send();
    }

    return $app['twig']->render('admin/project_type_add.html.twig', array(
        'form' => $form->createView(),
    ));
});

$app->match('/admin/project-type/edit/{id}', function ($id, Request $request) use ($app) {
    /* Выбираем тип проекта */
    $sql = "SELECT * FROM project_types WHERE id='" . $id . "'";
    $selected_project_type = $app['db']->fetchAll($sql);
    $selected_project_type = $selected_project_type[0];

    $form = $app['form.factory']
        ->createBuilder('form')
        ->add('name', 'text', array(
            'required' => true,
            'label' => 'Краткий идентификатор',
            'attr' => array(
                'value' => $selected_project_type['name'],
            ),
        ))
        ->add('full_name', 'text', array(
            'required' => true,
            'label' => 'Название категории',
            'attr' => array(
                'value' => $selected_project_type['full_name'],
            ),
        ))
        ->add('svg', 'textarea', array(
            'required' => true,
            'label' => 'Код svg иконки',
            'attr' => array(
                'value' => $selected_project_type['svg'],
                'style' => 'height: 500px',
            ),
        ))
        ->getForm();

    $form->handleRequest($request);

    if ($form->isValid()) {
        $data = $form->getData();

//* Вставка в project_types */
        $sql = "UPDATE project_types SET
            name = '" . $data['name'] . "',
            full_name = '" . $data['full_name'] . "',
            svg = '" . $data['svg'] . "'
            WHERE id = '" . $id . "'";

        $app['db']->exec($sql);

        /* Выкинуть на главную */
        $response = new RedirectResponse("/admin/project-types");
        $response->prepare($request);
        return $response->send();
    }
    return $app['twig']->render('admin/project_type_edit.html.twig', array(
        'form' => $form->createView(),
        'selected_project_type' => $selected_project_type,
    ));
});

$app->match('/admin/project-type/delete/{id}', function ($id, Request $request) use ($app) {
    $sql = "DELETE FROM project_types WHERE id='" . $id . "'";
    $app['db']->exec($sql);
    $sql = "DELETE FROM project_id_type WHERE project_type='" . $id . "'";
    $app['db']->exec($sql);

    /* Выкинуть на главную */
    $response = new RedirectResponse("/admin/project-types");
    $response->prepare($request);
    return $response->send();
});

/* ОТЗЫВЫ */

$app->match('/admin/review/add', function (Request $request) use ($app) {
    /* Выбираем все проекты */
    $sql = "SELECT * FROM projects";
    $projects = $app['db']->fetchAll($sql);
    $selects = array();
    for ($i=0; $i<count($projects); $i++){
        $selects[$projects[$i]['id']] = $projects[$i]['name'];
    }
    
    $form = $app['form.factory']
        ->createBuilder('form')
        ->add('project', 'choice', array(
            'choices' => $selects,
            'expanded' => false,
            'multiple' => false,
            'label' => 'Проект',
        ))
        ->add('name','text', array(
            'required' => true,
            'label' => 'Имя',
        ))
        ->add('company','text', array(
            'required' => true,
            'label' => 'Компания',
        ))
        ->add('position','text', array(
            'required' => true,
            'label' => 'Должность',
        ))
        ->add('review','textarea', array(
            'required' => true,
            'label' => 'Текст отзыва',
        ))
        ->add('avatar', 'file', array(
            'label' => 'Фотография',
            'required' => true,
        ))
        ->getForm();
    $form->handleRequest($request);
    if ($form->isValid()) {
        $data = $form->getData();
        
        /* Файлы */
        $files = $request->files->get($form->getName());
        
        /* Добавление фотографии автора */
        $path = __DIR__.'/../web/project_files/'.$data['project'].'/reviews/';
        $filename = $files['avatar']->getClientOriginalName();
        if (file_exists($path . $filename)){
            $salt = 0;
            while (file_exists($path . substr($filename,0,-4) . '_' . $salt . substr($filename,-4))){
                $salt++;
            }
            $filename = substr($filename,0,-4) . '_' . $salt . substr($filename,-4);
        }
        $files['avatar']->move($path,$filename);
        
        /* Вставка в project_review */
        $sql = "INSERT INTO project_review (project_id, author_avatar, author_name, author_company, author_position, review_text) 
            VALUES('".$data['project']."', '".$filename."', '".$data['name']."', '".$data['company']."', '".$data['position']."', '".$data['review']."')";
        $app['db']->exec($sql);
        
        /* Выкинуть на главную */
        $response = new RedirectResponse("/admin/reviews");
        $response->prepare($request);
        return $response->send();
    }
    
    return $app['twig']->render('admin/review_add.html.twig', array(
        'form' => $form->createView(),
    ));
});

$app->match('/admin/review/edit/{id}', function ($id,Request $request) use ($app) {
    /* Выбираем отзыв */
    $sql = "SELECT * FROM project_review WHERE id='".$id."'";
    $review = $app['db']->fetchAll($sql);
    $review = $review[0];
    
    /* Выбираем все проекты */
    $sql = "SELECT * FROM projects";
    $projects = $app['db']->fetchAll($sql);
    $selects = array();
    for ($i=0; $i<count($projects); $i++){
        $selects[$projects[$i]['id']] = $projects[$i]['name'];
    }
    
    $form = $app['form.factory']
        ->createBuilder('form')
        ->add('project', 'choice', array(
            'choices' => $selects,
            'expanded' => false,
            'multiple' => false,
            'label' => 'Проект',
            'data' => $review['project_id'],
        ))
        ->add('name','text', array(
            'required' => true,
            'label' => 'Имя',
            'attr' => array(
                'value' => $review['author_name'],
            ),
        ))
        ->add('company','text', array(
            'required' => true,
            'label' => 'Компания',
            'attr' => array(
                'value' => $review['author_company'],
            ),
        ))
        ->add('position','text', array(
            'required' => true,
            'label' => 'Должность',
            'attr' => array(
                'value' => $review['author_position'],
            ),
        ))
        ->add('review','textarea', array(
            'required' => true,
            'label' => 'Текст отзыва',
            'data' => $review['review_text'],
        ))
        ->add('avatar', 'file', array(
            'label' => 'Фотография',
            'required' => false,
        ))
        ->getForm();

    $form->handleRequest($request);

    if ($form->isValid()) {
        $data = $form->getData();
        
        /* Файлы */
        $files = $request->files->get($form->getName());
        
        /* Вставка в project_review */
        $sql = "UPDATE project_review SET 
            project_id = '".$data['project']."',
            author_name = '".$data['name']."',
            author_company = '".$data['company']."',
            author_position = '".$data['position']."',
            review_text = '".$data['review']."'
            WHERE id = '".$id."'";
        $app['db']->exec($sql);
        
        /* Добавление фотографии */
        if ($files['avatar']){
            // Удаляем старую фотографию
            $path = __DIR__.'/../web/project_files/'.$review['project_id'].'/reviews/';
            if (file_exists($path.$review['author_avatar'])){
                unlink($path);
            }
            // Добавляем новую фотографию
            if (file_exists($path . $filename)){
                $salt = 0;
                while (file_exists($path . substr($filename,0,-4) . '_' . $salt . substr($filename,-4))){
                    $salt++;
                }
                $filename = substr($filename,0,-4) . '_' . $salt . substr($filename,-4);
                $files['avatar']->move($path, $filename);
                $sql = "UPDATE project_review SET 
                    author_avatar = '".$filename."'
                    WHERE id = '".$id."'";
                $app['db']->exec($sql);
            }
        }
        /* Выкинуть на главную */
        $response = new RedirectResponse("/admin/reviews");
        $response->prepare($request);
        return $response->send();
    }
    return $app['twig']->render('admin/review_edit.html.twig', array(
        'form' => $form->createView(),
        'selected_review' => $review,
    ));
});

$app->match('/admin/review/delete/{id}', function ($id,Request $request) use ($app) {
    $sql = "SELECT * FROM project_review WHERE id='".$id."'";
    $review = $app['db']->fetchAll($sql);
    $review = $review[0];
    
    $path = __DIR__.'/../web/project_files/'.$review['project_id'].'/reviews/'.$review['author_avatar'];
    if (file_exists($path)){
        unlink($path);
    }
    
    $sql = "DELETE FROM project_review WHERE id='".$id."'";
    $app['db']->exec($sql);
    
    /* Выкинуть на главную */
        $response = new RedirectResponse("/admin/reviews");
        $response->prepare($request);
        return $response->send();
});

$app->match('/admin/about/edit', function (Request $request) use ($app) {
    $sql = "SELECT * FROM about_page";
    $color = $app['db']->fetchAll($sql);
    $sql = "SELECT * FROM about_text WHERE text_column = 'left'";
    $left_text = $app['db']->fetchAll($sql);
    $sql = "SELECT * FROM about_text WHERE text_column = 'right'";
    $right_text = $app['db']->fetchAll($sql);
    $sql = "SELECT * FROM about_team";
    $about_team = $app['db']->fetchAll($sql);
    $sql = "SELECT * FROM about_partners";
    $about_partners = $app['db']->fetchAll($sql);
    
    for ($i=0; $i<count($left_text); $i++){
        $collections['left_text'][$i] = $left_text[$i]['text'];
    }
    for ($i=0; $i<count($right_text); $i++){
        $collections['right_text'][$i] = $right_text[$i]['text'];
    }
    for ($i=0; $i<count($about_team); $i++){
        $collections['about_team_name'][$i] = $about_team[$i]['name'];
        $collections['about_team_position'][$i] = $about_team[$i]['position'];
        $collections['about_team_text'][$i] = $about_team[$i]['text'];
    }
    for ($i=0; $i<count($about_partners); $i++){
        $collections['about_partners_href'][$i] = $about_partners[$i]['href'];
    }
    $form = $app['form.factory']
        ->createBuilder('form', $collections)
        ->add('change_about_bg', 'file', array(
            'label' => false,
            'required' => false,
        ))
        ->add('color','text', array(
            'required' => true,
            'label' => 'Цвет оформления',
            'attr' => array(
                'value' => $color[0]['color'],
            )
        ))
        ->add('left_text', 'collection', array(
            'required' => false,
            'label' => 'Текст в левой колонке',
            'allow_add' => true,
            'allow_delete' => true,
            'attr' => array( 
                'data-name' => 'left_text',
            ),
            'type' => 'textarea',
        ))
        ->add('add_left_text', 'collection', array(
            'required' => false,
            'label' => false,
            'allow_add' => true,
            'allow_delete' => true,
            'type' => 'text',
        ))
        ->add('right_text', 'collection', array(
            'required' => true,
            'label' => 'Текст в правой колонке',
            'allow_add' => true,
            'allow_delete' => true,
            'attr' => array( 
                'data-name' => 'right_text',
            ),
            'type' => 'textarea',
        ))
        ->add('add_right_text', 'collection', array(
            'required' => false,
            'label' => false,
            'allow_add' => true,
            'allow_delete' => true,
            'type' => 'text',
        ))
        ->add('change_about_img', 'collection', array(
            'required' => false,
            'label' => false,
            'allow_add' => true,
            'allow_delete' => true,
            'type' => 'file',
        ))
        ->add('about_team_name', 'collection', array(
            'required' => true,
            'label' => 'Команда',
            'allow_add' => true,
            'allow_delete' => true,
            'attr' => array( 
                'data-name' => 'about_team_name',
            ),
            'options' => array(
                'label' => false,
            ),
        ))
        ->add('about_team_position', 'collection', array(
            'required' => true,
            'label' => 'Команда',
            'allow_add' => true,
            'allow_delete' => true,
            'attr' => array( 
                'data-name' => 'about_team_position',
            ),
            'options' => array(
                'label' => false,
            ),
        ))
        ->add('about_team_text', 'collection', array(
            'required' => true,
            'label' => 'Команда',
            'allow_add' => true,
            'allow_delete' => true,
            'attr' => array( 
                'data-name' => 'about_team_text',
            ),
            'options' => array(
                'label' => false,
            ),
        ))
        ->add('add_about_team_photo', 'collection', array(
            'required' => true,
            'label' => false,
            'allow_add' => true,
            'allow_delete' => true,
            'attr' => array( 
                'data-name' => 'add_about_team_name',
            ),
            'options' => array(
                'label' => false,
            ),
            'type' => 'file',
        ))
        ->add('add_about_team_name', 'collection', array(
            'required' => true,
            'label' => false,
            'allow_add' => true,
            'allow_delete' => true,
            'attr' => array( 
                'data-name' => 'add_about_team_name',
            ),
            'options' => array(
                'label' => false,
            ),
        ))
        ->add('add_about_team_position', 'collection', array(
            'required' => true,
            'label' => false,
            'allow_add' => true,
            'allow_delete' => true,
            'attr' => array( 
                'data-name' => 'add_about_team_position',
            ),
            'options' => array(
                'label' => false,
            ),
        ))
        ->add('add_about_team_text', 'collection', array(
            'required' => true,
            'label' => false,
            'allow_add' => true,
            'allow_delete' => true,
            'attr' => array( 
                'data-name' => 'add_about_team_text',
            ),
            'options' => array(
                'label' => false,
            ),
        ))
        ->add('about_partners_href', 'collection', array(
            'required' => true,
            'label' => 'Клиенты',
            'allow_add' => true,
            'allow_delete' => true,
            'attr' => array( 
                'data-name' => 'about_partners_href',
            ),
            'options' => array(
                'label' => false,
            ),
        ))
        ->add('change_about_partners_img', 'collection', array(
            'required' => false,
            'label' => false,
            'allow_add' => true,
            'allow_delete' => true,
            'attr' => array( 
                'data-name' => 'change_about_partners_img',
            ),
            'options' => array(
                'label' => false,
            ),
            'type' => 'file',
        ))
        ->add('add_about_partners_img', 'collection', array(
            'required' => false,
            'label' => false,
            'allow_add' => true,
            'allow_delete' => true,
            'attr' => array( 
                'data-name' => 'add_about_partners_img',
            ),
            'options' => array(
                'label' => false,
            ),
            'type' => 'file',
        ))
        ->add('add_about_partners_href', 'collection', array(
            'required' => false,
            'label' => false,
            'allow_add' => true,
            'allow_delete' => true,
            'attr' => array( 
                'data-name' => 'add_about_partners_href',
            ),
            'options' => array(
                'label' => false,
            ),
            'type' => 'text',
        ))
        ->getForm();
    $form->handleRequest($request);
    if ($form->isValid()) {
        $data = $form->getData();
        $files = $request->files->get($form->getName());
        
        /* Фоновая картинка */
        if (!empty($files['change_about_bg'])){
            $path = __DIR__.'/../web/img/about/bgs/';
            $filename = 'bg-top.jpg';
            $files['change_about_bg']->move($path,$filename);
        }
        /* Фоновая картинка */
        $sql = "UPDATE about_page SET 
            color = '".$data['color']."'";
        $app['db']->exec($sql);
        
        /* ТЕКСТ В ЛЕВОЙ КОЛОНКЕ */
        for ($i=0; $i<count($left_text); $i++){
            /* Если ничего не пришло, удаляем из бд, иначе переписываем */
            if (empty($data['left_text'][$i])){
                $sql = "DELETE FROM about_text WHERE id='".$left_text[$i]['id']."'";
                $app['db']->exec($sql);
            } else{
                $sql = "UPDATE about_text SET 
                    text = '".$data['left_text'][$i]."'
                    WHERE id = '".$left_text[$i]['id']."'";
                $app['db']->exec($sql);
            }            
        }
        /* Если добавились еще параграфы */
        if (!empty($data['add_left_text'])){
            for ($i=0; $i<count($data['add_left_text']); $i++){
                $sql = "INSERT INTO about_text (text, text_column) VALUES('".$data['add_left_text'][$i]."','left')";
                $app['db']->exec($sql);
            }
        }
        
        /* ТЕКСТ В ПРАВОЙ КОЛОНКЕ */
        for ($i=0; $i<count($right_text); $i++){
            /* Если ничего не пришло, удаляем из бд, иначе переписываем */
            if (empty($data['right_text'][$i])){
                $sql = "DELETE FROM about_text WHERE id='".$right_text[$i]['id']."'";
                $app['db']->exec($sql);
            } else{
                $sql = "UPDATE about_text SET 
                    text = '".$data['right_text'][$i]."'
                    WHERE id = '".$right_text[$i]['id']."'";
                $app['db']->exec($sql);
            }            
        }

        /* Если добавились еще параграфы */
        if (!empty($data['add_right_text'])){
            for ($i=0; $i<count($data['add_right_text']); $i++){
                $sql = "INSERT INTO about_text (text, text_column) VALUES('".$data['add_right_text'][$i]."','right')";
                $app['db']->exec($sql);
            }
        }
        
        /* КОМАНДА */
        for ($i=0; $i<count($about_team); $i++){
            /* Если ничего не пришло, удаляем из бд, иначе переписываем */
            if (empty($data['about_team_name'][$i]) && empty($data['about_team_position'][$i]) && empty($data['about_team_text'][$i])){
                if (file_exists(__DIR__.'/../web/img/about/team/'.$about_team[$i]['photo'])){
                    unlink(__DIR__.'/../web/img/about/team/'.$about_team[$i]['photo']);
                }
                $sql = "DELETE FROM about_team WHERE id='".$about_team[$i]['id']."'";
                $app['db']->exec($sql);
            } else{
                $sql = "UPDATE about_team SET 
                    name = '".$data['about_team_name'][$i]."',
                    position = '".$data['about_team_position'][$i]."',
                    text = '".$data['about_team_text'][$i]."'
                    WHERE id = '".$about_team[$i]['id']."'";
                $app['db']->exec($sql);
            }
            if (!empty($files['change_about_img'][$i])){
                $path = __DIR__.'/../web/img/about/team/';
                $filename = $files['change_about_img'][$i]->getClientOriginalName();
                if (file_exists($path . $filename)){
                    $salt = 0;
                    while (file_exists($path . substr($filename,0,-4) . '_' . $salt . substr($filename,-4))){
                        $salt++;
                    }
                    $filename = substr($filename,0,-4) . '_' . $salt . substr($filename,-4);
                }
                $files['change_about_img'][$i]->move($path,$filename);
                
                $sql = "UPDATE about_team SET 
                    photo = '".$filename."'
                    WHERE id = '".$about_team[$i]['id']."'";
                $app['db']->exec($sql);
                
            }
        }

        /* Если добавилась еще команда */
        if (!empty($files['add_about_team_photo']) && !empty($data['add_about_team_name']) && !empty($data['add_about_team_position']) && !empty($data['add_about_team_text'])){
            for ($i=0; $i<count($data['add_about_team_name']); $i++){
                if (empty($data['add_about_team_photo'][$i]) || empty($data['add_about_team_name'][$i]) || empty($data['add_about_team_position'][$i]) || empty($data['add_about_team_text'][$i])) continue;
                $path = __DIR__.'/../web/img/about/team/';
                $filename = $files['add_about_team_photo'][$i]->getClientOriginalName();
                if (file_exists($path . $filename)){
                    $salt = 0;
                    while (file_exists($path . substr($filename,0,-4) . '_' . $salt . substr($filename,-4))){
                        $salt++;
                    }
                    $filename = substr($filename,0,-4) . '_' . $salt . substr($filename,-4);
                }
                $files['add_about_team_photo'][$i]->move($path,$filename);
                
                $sql = "INSERT INTO about_team (name, position, text, photo) 
                    VALUES('".$data['add_about_team_name'][$i]."','".$data['add_about_team_position'][$i]."','".$data['add_about_team_text'][$i]."','".$filename."')";
                $app['db']->exec($sql);
            }
        }
        
        /* КЛИЕНТЫ */
        for ($i=0; $i<count($about_partners); $i++){
            /* Если ничего не пришло, удаляем из бд, иначе переписываем */
            if (empty($data['about_partners_href'][$i])){
                $sql = "DELETE FROM about_partners WHERE id='".$about_partners[$i]['id']."'";
                $app['db']->exec($sql);
            } else{
                $sql = "UPDATE about_partners SET 
                    href = '".$data['about_partners_href'][$i]."'
                    WHERE id = '".$about_partners[$i]['id']."'";
                $app['db']->exec($sql);
            }    
            if (!empty($files['change_about_partners_img'][$i])){
                $path = __DIR__.'/../web/img/about/partners/';
                $filename = $files['change_about_partners_img'][$i]->getClientOriginalName();
                if (file_exists($path . $filename)){
                    $salt = 0;
                    while (file_exists($path . substr($filename,0,-4) . '_' . $salt . substr($filename,-4))){
                        $salt++;
                    }
                    $filename = substr($filename,0,-4) . '_' . $salt . substr($filename,-4);
                }
                $files['change_about_partners_img'][$i]->move($path,$filename);
                
                $sql = "UPDATE about_partners SET 
                    img = '".$filename."'
                    WHERE id = '".$about_partners[$i]['id']."'";
                $app['db']->exec($sql);
            }
        }

        /* Если добавились еще клиенты */
        if (!empty($files['add_about_partners_img'])){
            for ($i=0; $i<count($files['add_about_partners_img']); $i++){
                if (empty($files['add_about_partners_img'][$i]) || empty($data['add_about_partners_href'][$i])) {
                    echo '1';
                    continue;
                } else {
                    $path = __DIR__.'/../web/img/about/partners/';
                    $filename = $files['add_about_partners_img'][$i]->getClientOriginalName();
                    if (file_exists($path . $filename)){
                        $salt = 0;
                        while (file_exists($path . substr($filename,0,-4) . '_' . $salt . substr($filename,-4))){
                            $salt++;
                        }
                        $filename = substr($filename,0,-4) . '_' . $salt . substr($filename,-4);
                    }
                    $files['add_about_partners_img'][$i]->move($path,$filename);
                    
                    $sql = "INSERT INTO about_partners (img, href) VALUES('".$filename."','".$data['add_about_partners_href'][$i]."')";
                    $app['db']->exec($sql);
                }
            }
        }
    
        /* Выкинуть на главную */
        $response = new RedirectResponse("/admin/pages");
        $response->prepare($request);
        return $response->send();
    }
    
    return $app['twig']->render('admin/about_edit.html.twig', array(
        'form' => $form->createView(),
        'team' => $about_team,
        'clients' => $about_partners,
    ));
});

return $app;    
