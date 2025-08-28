<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FinHabits | Inicio de Sesión</title>
    <link rel="stylesheet" href="../../Public/Css/loginYRegistro.css">
    <link rel="stylesheet" href="../../Public/Css/Index.css">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.12.1/css/all.css" crossorigin="anonymous">
</head>
<body>
    <section class="container">
        <section class="izquierda">
            <a href="../../home.html" class="back-home">
                <i class="fas fa-arrow-left"></i>
                Volver al inicio
            </a>
            
            <form class="auth-form" action="../Controler/login_Ctrl.php" method="POST" accept-charset="utf-8">
                <h1>Inicia Sesión</h1>
                <p class="subtitle">Bienvenido de vuelta, administra tus finanzas de manera inteligente</p>

                <!-- Mensajes de respuesta del servidor -->
                <div id="mensajes">
                    <?php
                    if(isset($_GET['mensaje'])) {
                        $mensaje = $_GET['mensaje'];
                        
                        switch($mensaje) {
                            case 'loginexitoso':
                                echo "<div class='alert alert-success'>Inicio de sesión exitoso. Redirigiendo...</div>";
                                echo "<script>setTimeout(() => { window.location.href = './usuarios/formulario.html'; }, 2000);</script>";
                                break;
                            case 'error':
                                echo "<div class='alert alert-danger'>Error, verifique sus datos y reintente</div>";
                                break;
                            case 'logout':
                                echo "<div class='alert alert-success'>Has cerrado sesión correctamente</div>";
                                break;
                            case 'sesionexpirada':
                                echo "<div class='alert alert-warning'>Tu sesión ha expirado. Inicia sesión nuevamente</div>";
                                break;
                        }
                    }
                    ?>
                </div>

                <div class="form-group">
                    <input type="email" name="correo" placeholder="Correo Electrónico" required>
                    <div class="icono">
                        <i class="fas fa-user"></i>
                    </div>
                </div>
                
                <div class="form-group password-field">
                    <input type="password" name="contrasena" placeholder="Contraseña" required>
                    <div class="icono">
                        <i class="fas fa-unlock"></i>
                    </div>
                    <button type="button" class="toggle-password" onclick="togglePassword()">
                        <i class="fas fa-eye" id="toggleIcon"></i>
                    </button>
                </div>

                <div class="form-options">
                    <div class="checkbox-group">
                        <input type="checkbox" id="recordar" name="recordar">
                        <label for="recordar">Recordar sesión</label>
                    </div>
                    <a href="#" class="forgot-password">¿Olvidaste tu contraseña?</a>
                </div>

                <button type="submit" class="btn-primary registro">
                    INICIAR SESIÓN
                </button>
                
                <h5>¿No tienes cuenta? <a href="../View/Registro.html">Regístrate Aquí</a></h5>
                
                <div class="divider">
                    <span>o inicia sesión con</span>
                </div>

                <div class="social-auth-row">
                    <button type="button" class="btn-social btn-google">
                        <i class="fab fa-google"></i>
                        Continuar con Google
                    </button>
                    <button type="button" class="btn-social btn-apple">
                        <i class="fab fa-apple"></i>
                        Continuar con Apple
                    </button>
                </div>
            </form>
        </section>

        <section class="derecha">
            <div class="logo">FinHabits</div>
            <h2>Bienvenido de vuelta</h2>
            <p>Continúa transformando tu futuro financiero. Accede a tu dashboard personalizado y mantén el control total de tus finanzas.</p>
            
            <div class="features-list">
                <div class="feature-item">
                    <i class="fas fa-chart-line"></i>
                    <span>Dashboard personalizado</span>
                </div>
                <div class="feature-item">
                    <i class="fas fa-piggy-bank"></i>
                    <span>Seguimiento de metas</span>
                </div>
                <div class="feature-item">
                    <i class="fas fa-bell"></i>
                    <span>Alertas inteligentes</span>
                </div>
            </div>
        </section>
    </section>

    <script>
        // Función para mostrar/ocultar contraseña
        function togglePassword() {
            const passwordField = document.querySelector('input[name="contrasena"]');
            const toggleIcon = document.getElementById('toggleIcon');
            
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                toggleIcon.classList.remove('fa-eye');
                toggleIcon.classList.add('fa-eye-slash');
            } else {
                passwordField.type = 'password';
                toggleIcon.classList.remove('fa-eye-slash');
                toggleIcon.classList.add('fa-eye');
            }
        }

        // Validación del formulario antes del envío
        document.querySelector('form').addEventListener('submit', function(e) {
            const correo = document.querySelector('input[name="correo"]').value.trim();
            const contrasena = document.querySelector('input[name="contrasena"]').value;
            
            if (!correo || !contrasena) {
                e.preventDefault();
                alert('Todos los campos son obligatorios');
                return false;
            }

            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(correo)) {
                e.preventDefault();
                alert('Por favor ingresa un correo electrónico válido');
                return false;
            }
        });

        // Auto-focus en el primer campo al cargar la página
        window.addEventListener('load', function() {
            document.querySelector('input[name="correo"]').focus();
        });
    </script>

    <style>
        .alert {
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: center;
            font-weight: 500;
        }
        
        .alert-success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .alert-danger {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }

        .alert-warning {
            background-color: #fff3cd;
            color: #856404;
            border: 1px solid #ffeaa7;
        }

        .form-group {
            position: relative;
            margin-bottom: 20px;
        }

        .form-group .icono {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: #666;
        }

        .form-group input {
            padding-left: 45px;
        }

        .password-field .toggle-password {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            cursor: pointer;
            color: #666;
            font-size: 16px;
            padding: 5px;
        }

        .toggle-password:hover {
            color: #333;
        }

        .form-options {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 15px 0;
            font-size: 14px;
        }

        .forgot-password {
            color: #3498db;
            text-decoration: none;
        }

        .forgot-password:hover {
            text-decoration: underline;
        }

        .features-list {
            margin-top: 30px;
        }

        .feature-item {
            display: flex;
            align-items: center;
            margin: 15px 0;
            color: rgba(255, 255, 255, 0.8);
        }

        .feature-item i {
            margin-right: 12px;
            font-size: 18px;
            color: #3498db;
        }

        .checkbox-group {
            display: flex;
            align-items: center;
        }

        .checkbox-group input[type="checkbox"] {
            margin-right: 8px;
        }

        .divider {
            text-align: center;
            margin: 20px 0;
            position: relative;
            color: #666;
        }

        .divider::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 1px;
            background: #ddd;
        }

        .divider span {
            background: white;
            padding: 0 15px;
            position: relative;
        }

        .social-auth-row {
            display: flex;
            gap: 10px;
        }

        .btn-social {
            flex: 1;
            padding: 12px;
            border: 1px solid #ddd;
            background: white;
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 0.3s ease;
        }

        .btn-social:hover {
            background: #f8f9fa;
        }

        .btn-google {
            color: #db4437;
        }

        .btn-apple {
            color: #333;
        }
    </style>
</body>
</html>