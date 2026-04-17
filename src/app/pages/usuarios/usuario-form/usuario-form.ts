import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../../core/services/usuario.service';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './usuario-form.html',
  styleUrl: './usuario-form.css',
})
export class UsuarioForm implements OnInit {
  nombre: string = '';
  apellidopaterno: string = '';
  apellidomaterno: string = '';
  correo: string = '';
  username: string = '';
  password: string = '';
  rolesids: number[] = [];

  rolesDisponibles = [
    { id: 1, nombre: 'ADMIN' },
    { id: 3, nombre: 'AGENTE' },
    { id: 2, nombre: 'USER' },
  ];

  modoEdicion: boolean = false;
  usuarioId: number | null = null;
  formularioListo: boolean = false;
  cargando: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  errores: { [key: string]: string } = {};

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('ID recibido:', id);
    if (id) {
      this.modoEdicion = true;
      this.usuarioId = Number(id);
      this.cargarUsuario(this.usuarioId);
    } else {
      this.formularioListo = true;
    }
  }

  cargarUsuario(id: number): void {
    this.cargando = true;
    this.formularioListo = false;
    this.usuarioService.obtenerPorId(id).subscribe({
      next: (res) => {
        if (res.correct && res.object) {
          const usuario = res.object;
          this.nombre = usuario.nombre;
          this.apellidopaterno = usuario.apellidopaterno;
          this.apellidomaterno = usuario.apellidomaterno;
          this.correo = usuario.correo;
          this.username = usuario.username;
        } else {
          this.errorMessage = res.ErrorMessage || 'Error al cargar usuario';
        }
        this.cargando = false;
        this.formularioListo = true;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Error al conectar con el servidor';

        this.cargando = false;
        this.formularioListo = true;
        this.cdr.detectChanges();
      },
    });
  }

  toggleRol(id: number): void {
    const index = this.rolesids.indexOf(id);
    if (index === -1) {
      this.rolesids.push(id);
    } else {
      this.rolesids.splice(index, 1);
    }
  }

  tieneRol(id: number): boolean {
    return this.rolesids.includes(id);
  }


  private soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
  private regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private iniciaConLetra = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/;


  validarCampo(campo: string): void {
    this.errores[campo] = '';

    switch (campo) {
      case 'nombre':
        if (!this.nombre.trim())
          this.errores['nombre'] = 'El nombre es obligatorio';
        else if (!this.soloLetras.test(this.nombre.trim()))
          this.errores['nombre'] = 'Solo se permiten letras';
        break;

      case 'apellidopaterno':
        if (!this.apellidopaterno.trim())
          this.errores['apellidopaterno'] = 'El apellido paterno es obligatorio';
        else if (!this.soloLetras.test(this.apellidopaterno.trim()))
          this.errores['apellidopaterno'] = 'Solo se permiten letras';
        break;

      case 'apellidomaterno':
        if (this.apellidomaterno.trim() && !this.soloLetras.test(this.apellidomaterno.trim()))
          this.errores['apellidomaterno'] = 'Solo se permiten letras';
        break;

      case 'correo':
        if (!this.correo.trim())
          this.errores['correo'] = 'El correo es obligatorio';
        else if (!this.regexCorreo.test(this.correo.trim()))
          this.errores['correo'] = 'Ingresa un correo válido (ejemplo@correo.com)';
        break;

      case 'username':
        if (!this.username.trim())
          this.errores['username'] = 'El nombre de usuario es obligatorio';
        else if (!this.iniciaConLetra.test(this.username.trim()))
          this.errores['username'] = 'El usuario no puede iniciar con números';
        else if (this.username.trim().length < 3)
          this.errores['username'] = 'Mínimo 3 caracteres';
        break;

      case 'password':
        if (!this.modoEdicion) {
          if (!this.password.trim())
            this.errores['password'] = 'La contraseña es obligatoria';
          else if (this.password.length < 8)
            this.errores['password'] = 'Mínimo 8 caracteres';
          else if (this.password.length > 50)
            this.errores['password'] = 'Máximo 50 caracteres';
        }
        break;
    }
  }

  private validarTodo(): boolean {
    ['nombre', 'apellidopaterno', 'apellidomaterno', 'correo', 'username', 'password'].forEach(
      (c) => this.validarCampo(c)
    );
    return Object.values(this.errores).every((e) => !e);
  }



  guardar(): void {
    this.errorMessage = '';

    if (
      !this.nombre.trim() ||
      !this.apellidopaterno.trim() ||
      !this.correo.trim() ||
      !this.username.trim()
    ) {
      this.errorMessage = 'Todos los campos son obligatorios';
      return;
    }

    if (!this.modoEdicion && !this.password.trim()) {
      this.errorMessage = 'La contraseña es obligatoria para nuevos usuarios';
      return;
    }

    if (!this.modoEdicion && this.rolesids.length === 0) {
      this.errorMessage = 'Debe asignar al menos un rol al usuario';
      return;
    }

    this.cargando = true;

    if (this.modoEdicion && this.usuarioId) {
      const datos = {
        nombre: this.nombre,
        apellidopaterno: this.apellidopaterno,
        apellidomaterno: this.apellidomaterno,
        correo: this.correo,
        username: this.username,
      };

      this.usuarioService.actualizar(this.usuarioId, datos).subscribe({
        next: (res) => {
          this.cargando = false;
          if (res.correct) {
            this.successMessage = 'Usuario actualizado correctamente';
            this.cdr.detectChanges();
            setTimeout(() => this.router.navigate(['/usuarios']), 1500);
          } else {
            this.errorMessage = res.ErrorMessage || 'Error al actualizar usuario';
            this.cdr.detectChanges();
          }
        },
        error: () => {
          this.cargando = false;
          this.errorMessage = 'Error al conectar con el servidor';
          this.cdr.detectChanges();
        },
      });
    } else {
      const datos = {
        nombre: this.nombre,
        apellidopaterno: this.apellidopaterno,
        apellidomaterno: this.apellidomaterno,
        correo: this.correo,
        username: this.username,
        password: this.password,
        rolesids: this.rolesids,
      };

      this.usuarioService.crear(datos).subscribe({
        next: (res) => {
          this.cargando = false;
          if (res.correct) {
            this.successMessage = 'Usuario creado correctamente';
            this.cdr.detectChanges();
            setTimeout(() => this.router.navigate(['/usuarios']), 1500);
          } else {
            this.errorMessage = res.ErrorMessage || 'Error al crear usuario';
            this.cdr.detectChanges();
          }
        },
        error: () => {
          this.cargando = false;
          this.errorMessage = 'Error al conectar con el servidor';
          this.cdr.detectChanges();
        },
      });
    }
  }
}
