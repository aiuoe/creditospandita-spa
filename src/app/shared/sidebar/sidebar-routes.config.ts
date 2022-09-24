import { RouteInfo } from './sidebar.metadata';
import { environment } from 'environments/environment';

export const ROUTES: RouteInfo[] = [
  {
    path: '/home',
    title: 'Home',
    icon: 'ft-home',
    class: '',
    badge: '',
    badgeClass: '',
    isExternalLink: false,
    toggle:false,
    submenu: []
  }
];

export const ADMIN_ROUTES: RouteInfo[] = [
 
 
      {
        path: '/users/',
        title: 'Usuarios Clientes',
        icon: 'ft-user',
        isExternalLink: false,
        class: 'has-sub',
        badge: '',
        badgeClass: '',
        toggle:true,
        submenu: [
          {
            path: '/admin/users/list',
            title: 'Lista',
            icon: 'ft-list',
            isExternalLink: false,
            class: 'ocul',
            badge: '',
            badgeClass: '',
            toggle:true,
            submenu: []
          },
          // {
          //   path: '/admin/user/add',
          //   title: 'Agregar',
          //   icon: 'ft-user-plus',
          //   isExternalLink: false,
          //   class: '',
          //   badge: '',
          //   badgeClass: '',
          //   toggle:true,
          //   submenu: []
          // }
        ]
      },
      {
        path: '/users/',
        title: 'Usuarios Admin',
        icon: 'ft-user',
        isExternalLink: false,
        class: 'has-sub',
        badge: '',
        badgeClass: '',
        toggle:true,
        submenu: [
          {
            path: '/admin/users/list-admin',
            title: 'Lista',
            icon: 'ft-list',
            isExternalLink: false,
            class: 'ocul',
            badge: '',
            badgeClass: '',
            toggle:true,
            submenu: []
          },
          {
            path: '/admin/user/add-admin',
            title: 'Agregar',
            icon: 'ft-user-plus',
            isExternalLink: false,
            class: '',
            badge: '',
            badgeClass: '',
            toggle:true,
            submenu: []
          }
        ]
      },
     
      {
        path: '/blog/',
        title: 'Blogs',
        icon: 'ft-user',
        isExternalLink: false,
        class: 'has-sub',
        badge: '',
        badgeClass: '',
        toggle:false,
        submenu: [
          {
            path: '/admin/blog/list',
            title: 'Lista',
            icon: 'ft-list',
            isExternalLink: false,
            class: '',
            badge: '',
            badgeClass: '',
            toggle:true,
            submenu: []
          },
          {
            path: '/admin/blog/add',
            title: 'Agregar',
            icon: 'ft-user-plus',
            isExternalLink: false,
            class: '',
            badge: '',
            badgeClass: '',
            toggle:true,
            submenu: []
          }
        ]
      },
      {
        path: '/coup/',
        title: 'Cupones',
        icon: 'ft-user',
        isExternalLink: false,
        class: 'has-sub',
        badge: '',
        badgeClass: '',
        toggle:true,
        submenu: [
          {
            path: '/admin/cupones',
            title: 'Lista',
            icon: 'ft-list',
            isExternalLink: false,
            class: '',
            badge: '',
            badgeClass: '',
            toggle:true,
            submenu: []
          },
          {
            path: '/admin/cupones/add',
            title: 'Agregar',
            icon: 'ft-user-plus',
            isExternalLink: false,
            class: '',
            badge: '',
            badgeClass: '',
            toggle:true,
            submenu: []
          }
        ]
      },
      {
        path: '/correos/',
        title: 'Gestor correo',
        icon: 'ft-user',
        isExternalLink: false,
        class: 'has-sub',
        badge: '',
        badgeClass: '',
        toggle:false,
        submenu: [
          {
            path: '/admin/correos/list',
            title: 'Lista',
            icon: 'ft-list',
            isExternalLink: false,
            class: '',
            badge: '',
            badgeClass: '',
            toggle:true,
            submenu: []
          },
          {
            path: '/admin/correos/add',
            title: 'Agregar',
            icon: 'ft-user-plus',
            isExternalLink: false,
            class: '',
            badge: '',
            badgeClass: '',
            toggle:true,
            submenu: []
          }
        ]
      },
      {
        path: '/Evaluacions/',
        title: 'Evaluacion',
        icon: 'ft-user',
        isExternalLink: false,
        class: 'has-sub',
        badge: '',
        badgeClass: '',
        toggle:false,
        submenu: [
          {
            path: '/admin/evaluacion/list',
            title: 'Lista',
            icon: 'ft-list',
            isExternalLink: false,
            class: '',
            badge: '',
            badgeClass: '',
            toggle:true,
            submenu: []
          },
          // {
          //   path: '/admin/blog/add',
          //   title: 'Agregar',
          //   icon: 'ft-user-plus',
          //   isExternalLink: true,
          //   class: '',
          //   badge: '',
          //   badgeClass: '',
          //   toggle:true,
          //   submenu: []
          // }
        ]
      },
      {
        path: '/Filtro/',
        title: 'Filtro',
        icon: 'ft-user',
        isExternalLink: false,
        class: 'has-sub',
        badge: '',
        badgeClass: '',
        toggle:false,
        submenu: [
          {
            path: '/admin/filtrando/list',
            title: 'Lista',
            icon: 'ft-list',
            isExternalLink: false,
            class: '',
            badge: '',
            badgeClass: '',
            toggle:true,
            submenu: []
          },
          {
            path: '/admin/filtrado/add',
            title: 'Agregar',
            icon: 'ft-user-plus',
            isExternalLink: false,
            class: '',
            badge: '',
            badgeClass: '',
            toggle:true,
            submenu: []
          }
        ]
      },
      {
        path: '/preguntass/',
        title: 'Preguntas',
        icon: 'ft-user',
        isExternalLink: false,
        class: 'has-sub',
        badge: '',
        badgeClass: '',
        toggle:false,
        submenu: [
          {
            path: '/admin/preguntas/list',
            title: 'Lista',
            icon: 'ft-list',
            isExternalLink: false,
            class: '',
            badge: '',
            badgeClass: '',
            toggle:true,
            submenu: []
          },
          {
            path: '/admin/preguntas/add',
            title: 'Agregar',
            icon: 'ft-user-plus',
            isExternalLink: false,
            class: '',
            badge: '',
            badgeClass: '',
            toggle:true,
            submenu: []
          }
        ]
      },
      {
        path: '/parascores/',
        title: 'Analisis crediticio',
        icon: 'ft-user',
        isExternalLink: false,
        class: 'has-sub',
        badge: '',
        badgeClass: '',
        toggle:false,
        submenu: [
          {
            path: '/admin/atributos/list',
            title: 'Atributos',
            icon: 'ft-user-plus',
            isExternalLink: false,
            class: '',
            badge: '',
            badgeClass: '',
            toggle:true,
            submenu: []
          },
          {
            path: '/admin/parascore/list',
            title: 'Score',
            icon: 'ft-list',
            isExternalLink: false,
            class: '',
            badge: '',
            badgeClass: '',
            toggle:true,
            submenu: []
          },
          {
            path: '/admin/contraofert/list',
            title: 'Contra oferta',
            icon: 'ft-list',
            isExternalLink: false,
            class: '',
            badge: '',
            badgeClass: '',
            toggle:true,
            submenu: []
          },
          // {
          //   path: '/admin/config-contra-oferta/1',
          //   title: 'Contra oferta',
          //   icon: 'ft-edit',
          //   isExternalLink: false,
          //   class: '',
          //   badge: '',
          //   badgeClass: '',
          //   toggle:true,
          //   submenu: []contraofert
          // }
        
        ]
      },
      {
        path: '/admin/blacklist',
        title: 'Lista Negra',
        icon: 'ft-list',
        isExternalLink: false,
        class: '',
        badge: '',
        badgeClass: '',
        toggle:true,
        submenu: []
      },
      // {
      //   path: '/variabless/',
      //   title: 'Variables',
      //   icon: 'ft-user',
      //   isExternalLink: false,
      //   class: 'has-sub',
      //   badge: '',
      //   badgeClass: '',
      //   toggle:false,
      //   submenu: [
      //     {
      //       path: '/admin/variables/list',
      //       title: 'Lista',
      //       icon: 'ft-list',
      //       isExternalLink: false,
      //       class: '',
      //       badge: '',
      //       badgeClass: '',
      //       toggle:true,
      //       submenu: []
      //     },
      //     {
      //       path: '/admin/variables/add',
      //       title: 'Agregar',
      //       icon: 'ft-user-plus',
      //       isExternalLink: false,
      //       class: '',
      //       badge: '',
      //       badgeClass: '',
      //       toggle:true,
      //       submenu: []
      //     }
      //   ]
      // },
      {
        path: '/textimonial/',
        title: 'Testimoniales',
        icon: 'ft-user',
        isExternalLink: false,
        class: 'has-sub',
        badge: '',
        badgeClass: '',
        toggle:false,
        submenu: [
          {
            path: '/admin/testimonial/list',
            title: 'Lista',
            icon: 'ft-list',
            isExternalLink: false,
            class: '',
            badge: '',
            badgeClass: '',
            toggle:true,
            submenu: []
          },
          {
            path: '/admin/testimonial/add',
            title: 'Agregar',
            icon: 'ft-user-plus',
            isExternalLink: false,
            class: '',
            badge: '',
            badgeClass: '',
            toggle:true,
            submenu: []
          }
        ]
      },
      {
        path: '/contacts-form/',
        title: 'Contacto',
        icon: 'ft-user',
        isExternalLink: false,
        class: 'has-sub',
        badge: '',
        badgeClass: '',
        toggle:false,
        submenu: [
          {
            path: '/admin/contacts-form/list',
            title: 'Lista',
            icon: 'ft-list',
            isExternalLink: false,
            class: '',
            badge: '',
            badgeClass: '',
            toggle:true,
            submenu: []
          }
        ]
      },
      {
        path: '/config-calculadora/',
        title: 'Calculadoras',
        icon: 'ft-settings',
        isExternalLink: false,
        class: 'has-sub',
        badge: '',
        badgeClass: '',
        toggle:false,
        submenu: [
          {
            path: '/admin/config-calculadora/list',
            title: 'Lista',
            icon: 'ft-list',
            isExternalLink: false,
            class: '',
            badge: '',
            badgeClass: '',
            toggle:true,
            submenu: []
          }
        ]
      },
      {
        path: '/admin/users/list-referidos',
        title: 'Referidos',
        icon: 'ft-list',
        isExternalLink: false,
        class: '',
        badge: '',
        badgeClass: '',
        toggle:true,
        submenu: []
      },
      {
        path: '/admin/cannonAlojamiento/lista',
        title: 'Cannon Alojamiento',
        icon: 'ft-list',
        isExternalLink: false,
        class: '',
        badge: '',
        badgeClass: '',
        toggle:true,
        submenu: []
      },
      {
        path: '/admin/ingreso-actividad/list',
        title: 'Ingreso de Actividad',
        icon: 'ft-list',
        isExternalLink: false,
        class: '',
        badge: '',
        badgeClass: '',
        toggle:true,
        submenu: []
      },
      {
        path: '/admin/creditoproceso',
        title: 'Creditos en Proceso',
        icon: 'ft-list',
        isExternalLink: false,
        class: '',
        badge: '',
        badgeClass: '',
        toggle:true,
        submenu: []
      },
      {
        path: '/admin/abiertos',
        title: 'Creditos Activos',
        icon: 'ft-list',
        isExternalLink: false,
        class: '',
        badge: '',
        badgeClass: '',
        toggle:true,
        submenu: []
      },
      {
        path: '/admin/cobranzas',
        title: 'Cobranzas',
        icon: 'ft-list',
        isExternalLink: false,
        class: 'has-sub',
        badge: '',
        badgeClass: '',
        toggle: false,
        submenu: [
          {
            path: '/admin/cobranzas/morosos',
            title: 'Morosos',
            icon: 'ft-list',
            isExternalLink: false,
            class: '',
            badge: '',
            badgeClass: '',
            toggle:true,
            submenu: []
          }
        ]
      },
      {
        path: '/admin/cerrados',
        title: 'Creditos Cerrados',
        icon: 'ft-list',
        isExternalLink: false,
        class: '',
        badge: '',
        badgeClass: '',
        toggle:true,
        submenu: []
      },
      {
        path: '/admin/estadistica',
        title: 'Estadisticas',
        icon: 'ft-activity',
        isExternalLink: false,
        class: '',
        badge: '',
        badgeClass: '',
        toggle:true,
        submenu: []
      },

];

//Client Routes

export const CLIENT_ROUTES: RouteInfo[] = [
  {
    path: '/home',
    title: 'Perfil',
    icon: 'ft-user',
    class: '',
    badge: '',
    badgeClass: '',
    isExternalLink: false,
    toggle:true,
    submenu: []
  },
  {
    path: '/credit/new-request',
    title: 'Nueva solicitud',
    icon: 'ft-plus',
    isExternalLink: false,
    class: '',
    badge: '',
    badgeClass: '',
    toggle:true,
    submenu: []
  },
  {
    path: '/contract/sign',
    title: 'Firmar contrato',
    icon: 'ft-edit',
    class: '',
    badge: '',
    badgeClass: '',
    isExternalLink: false,
    toggle:true,
    submenu: []
  },
  {
    path: '/credit/',
    title: 'Crédito',
    icon: 'ft-file',
    class: 'has-sub',
    badge: '',
    badgeClass: '',
    toggle:false,
    isExternalLink: false,
    submenu: [
      // {
      //   path: '/credit/contra-ofertas',
      //   title: 'Contra ofertas',
      //   icon: 'ft-list',
      //   isExternalLink: false,
      //   class: '',
      //   badge: '',
      //   badgeClass: '',
      //   toggle:false,
      //   submenu: []
      // },
      // {
      //   path: '/credit/pre-approved',
      //   title: 'Pre aprobado',
      //   icon: 'ft-list',
      //   isExternalLink: false,
      //   class: '',
      //   badge: '',
      //   badgeClass: '',
      //   toggle:false,
      //   submenu: []
      // },
      {
        path: '/credit/approved',
        title: 'En proceso',
        icon: 'ft-list',
        isExternalLink: false,
        class: '',
        badge: '',
        badgeClass: '',
        toggle:true,
        submenu: []
      },
      {
        path: '/credit/disbursed',
        title: 'Activos',
        icon: 'ft-list',
        isExternalLink: false,
        class: '',
        badge: '',
        badgeClass: '',
        toggle:true,
        submenu: []
      },
      {
        path: '/credit/paid',
        title: 'Pagado',
        icon: 'ft-list',
        isExternalLink: false,
        class: '',
        badge: '',
        badgeClass: '',
        toggle:true,
        submenu: []
      },
    ]
  },
  {
    path: '/credit/creditHistory',
    title: 'Historial Crediticio',
    icon: 'ft-plus',
    isExternalLink: false,
    class: '',
    badge: '',
    badgeClass: '',
    toggle:true,
    submenu: []
  },
  {
    path: '/admin-credit/adicionals',
    title: 'Info.Adicional',
    icon: 'ft-upload-cloud',
    isExternalLink: false,
    class: 'has-sub',
    badge: '',
    badgeClass: '',
    toggle:false,
    submenu: [
      {
        path: '/admin-credit/adicional/add',
        title: 'Agregar',
        icon: 'ft-plus',
        class: '',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        toggle:true,
        submenu: []
      },
      {
        path: '/admin-credit/adicional/list',
        title: 'Lista',
        icon: 'ft-list',
        class: '',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        toggle:true,
        submenu: []
      },
    ]
  },

  // {
  //   path: '/admin-credit',
  //   title: 'Pagar Créditos',
  //   icon: 'ft-activity',
  //   class: '',
  //   badge: '',
  //   badgeClass: '',
  //   isExternalLink: false,
  //   toggle:true,
  //   submenu: []
  // },
  // {
  //   path: '/credit/novacion',
  //   title: 'Novación',
  //   icon: 'ft-watch',
  //   class: '',
  //   badge: '',
  //   badgeClass: '',
  //   isExternalLink: false,
  //   toggle:true,
  //   submenu: []
  // }, 



];

//Referido Routes

export const REFERIDOR_ROUTES: RouteInfo[] = [
  {
    path: '/home',
    title: 'Perfil',
    icon: 'ft-user',
    class: '',
    badge: '',
    badgeClass: '',
    isExternalLink: false,
    toggle:true,
    submenu: []
  },
  {
    path: '/credit/new-request',
    title: 'Nueva solicitud',
    icon: 'ft-plus',
    isExternalLink: false,
    class: '',
    badge: '',
    badgeClass: '',
    toggle:true,
    submenu: []
  },
  // {
  //   path: '/credit/referido',
  //   title: 'Plan de referidos',
  //   icon: 'ft-users',
  //   class: '',
  //   badge: '',
  //   badgeClass: '',
  //   isExternalLink: false,
  //   toggle:false,
  //   submenu: []
  // }, 
  
  {
    path: '/Plan/',
    title: 'Plan Referidos',
    icon: 'ft-users',
    class: 'has-sub',
    badge: '',
    badgeClass: '',
    toggle:false,
    isExternalLink: false,
    submenu: [
    
      {
        path: '/credit/referido',
        title: 'Referir',
        icon: 'ft-list',
        isExternalLink: false,
        class: '',
        badge: '',
        badgeClass: '',
        toggle:true,
        submenu: []
      },
      
      {
        path: '/admin/gananciasPlan',
        title: 'Ganancias',
        icon: 'ft-list',
        isExternalLink: false,
        class: '',
        badge: '',
        badgeClass: '',
        toggle:true,
        submenu: []
      },
      {
        path: '/admin/users/list-mis-referidos',
        title: 'Mis referidos',
        icon: 'ft-list',
        isExternalLink: false,
        class: '',
        badge: '',
        badgeClass: '',
        toggle:true,
        submenu: []
      },
    ]
  },
  {
    path: '/admin-credit/adicionals',
    title: 'Info.Adicional',
    icon: 'ft-upload-cloud',
    isExternalLink: false,
    class: 'has-sub',
    badge: '',
    badgeClass: '',
    toggle:false,
    submenu: [
      {
        path: '/admin-credit/adicional/add',
        title: 'Agregar',
        icon: 'ft-plus',
        class: '',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        toggle:true,
        submenu: []
      },
      {
        path: '/admin-credit/adicional/list',
        title: 'Lista',
        icon: 'ft-list',
        class: '',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        toggle:true,
        submenu: []
      },
    ]
  },



];

//ClientReferidor Routes

export const CLIENTREFERIDOR_ROUTES: RouteInfo[] = [
  {
    path: '/home',
    title: 'Perfil',
    icon: 'ft-user',
    class: '',
    badge: '',
    badgeClass: '',
    isExternalLink: false,
    toggle:true,
    submenu: []
  },
  {
    path: '/credit/new-request',
    title: 'Nueva solicitud',
    icon: 'ft-plus',
    isExternalLink: false,
    class: '',
    badge: '',
    badgeClass: '',
    toggle:true,
    submenu: []
  },
  {
    path: '/contract/sign',
    title: 'Firmar contrato',
    icon: 'ft-edit',
    class: '',
    badge: '',
    badgeClass: '',
    isExternalLink: false,
    toggle:true,
    submenu: []
  },
  {
    path: '/credit/',
    title: 'Crédito',
    icon: 'ft-file',
    class: 'has-sub',
    badge: '',
    badgeClass: '',
    toggle:false,
    isExternalLink: false,
    submenu: [
      // {
      //   path: '/credit/contra-ofertas',
      //   title: 'Contra ofertas',
      //   icon: 'ft-list',
      //   isExternalLink: false,
      //   class: '',
      //   badge: '',
      //   badgeClass: '',
      //   toggle:false,
      //   submenu: []
      // },
      // {
      //   path: '/credit/pre-approved',
      //   title: 'Pre aprobado',
      //   icon: 'ft-list',
      //   isExternalLink: false,
      //   class: '',
      //   badge: '',
      //   badgeClass: '',
      //   toggle:false,
      //   submenu: []
      // },
      {
        path: '/credit/approved',
        title: 'En proceso',
        icon: 'ft-list',
        isExternalLink: false,
        class: '',
        badge: '',
        badgeClass: '',
        toggle:true,
        submenu: []
      },
      {
        path: '/credit/disbursed',
        title: 'Activos',
        icon: 'ft-list',
        isExternalLink: false,
        class: '',
        badge: '',
        badgeClass: '',
        toggle:true,
        submenu: []
      },
      {
        path: '/credit/paid',
        title: 'Pagado',
        icon: 'ft-list',
        isExternalLink: false,
        class: '',
        badge: '',
        badgeClass: '',
        toggle:true,
        submenu: []
      },
    ]
  },
  {
    path: '/credit/creditHistory',
    title: 'Historial Crediticio',
    icon: 'ft-plus',
    isExternalLink: false,
    class: '',
    badge: '',
    badgeClass: '',
    toggle:true,
    submenu: []
  },
  {
    path: '/admin-credit/adicionals',
    title: 'Info.Adicional',
    icon: 'ft-upload-cloud',
    isExternalLink: false,
    class: 'has-sub',
    badge: '',
    badgeClass: '',
    toggle:false,
    submenu: [
      {
        path: '/admin-credit/adicional/add',
        title: 'Agregar',
        icon: 'ft-plus',
        class: '',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        toggle:true,
        submenu: []
      },
      {
        path: '/admin-credit/adicional/list',
        title: 'Lista',
        icon: 'ft-list',
        class: '',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        toggle:true,
        submenu: []
      },
    ]
  },


 
  {
    path: '/Plan/',
    title: 'Plan Referidos',
    icon: 'ft-users',
    class: 'has-sub',
    badge: '',
    badgeClass: '',
    toggle:false,
    isExternalLink: false,
    submenu: [
    
      {
        path: '/credit/referido',
        title: 'Referir',
        icon: 'ft-list',
        isExternalLink: false,
        class: '',
        badge: '',
        badgeClass: '',
        toggle:true,
        submenu: []
      },
      
      {
        path: '/admin/gananciasPlan',
        title: 'Ganancias',
        icon: 'ft-list',
        isExternalLink: false,
        class: '',
        badge: '',
        badgeClass: '',
        toggle:true,
        submenu: []
      },
      {
        path: '/admin/users/list-mis-referidos',
        title: 'Mis referidos',
        icon: 'ft-list',
        isExternalLink: false,
        class: '',
        badge: '',
        badgeClass: '',
        toggle:true,
        submenu: []
      },
    ]
  },
  
];
