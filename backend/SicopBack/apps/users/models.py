from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin
from django.core.validators import RegexValidator
from django.contrib.auth.hashers import make_password 

class UserManager(BaseUserManager):
    def _create_user(self, username, email, name, last_name, password, is_staff, is_superuser, is_active, **extra_fields):
        user = self.model(
            username = username,
            email = email,
            name = name,
            last_name = last_name,
            is_staff = is_staff,
            is_superuser = is_superuser,
            is_active = is_active,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self.db)
        return user 
    
    def create_user(self, username, email, name, last_name, password=None, **extra_fields):
        return self._create_user(username, email, name, last_name, password, False, False, True, **extra_fields)
    
    def create_superuser(self, username, email, name, last_name, password=None, **extra_fields):
        extra_fields.setdefault('rol', User.ADMINISTRADOR) 
        return self._create_user(username, email, name, last_name, password, True, True, True, **extra_fields)
    
    
class User(AbstractBaseUser, PermissionsMixin):

    # DEFINICIÓN DE ROLES
    ADMINISTRADOR = 1
    INVESTIGADOR = 2
    ROL_CHOICES = ((ADMINISTRADOR, 'Administrador'),(INVESTIGADOR, 'Investigador'),)

    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField('Correo Electronico',max_length=255,unique=True)
    name = models.CharField('Nombres', max_length=255, blank=True,null=True,validators=[RegexValidator(regex=r'^[a-zA-Z\s]*$',
        message="El nombre solo puede contener letras y espacios.")])
    last_name = models.CharField('Apellidos', max_length=255, blank=True,null=True,validators=[RegexValidator(regex=r'^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$',
        message='El formato del apellido no es válido')])
    image = models.ImageField('Foto de perfil', upload_to='perfil/',max_length=255, null=True, blank=True)

    # CAMPO DE ROL
    rol = models.PositiveSmallIntegerField(choices=ROL_CHOICES,default=INVESTIGADOR, verbose_name='Rol del Usuario')

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=True)
    objects = UserManager()

    #
    def save(self, *args, **kwargs):
        if self.password and not self.password.startswith(('pbkdf2_sha256', 'bcrypt')):
            self.password = make_password(self.password)
            
        super().save(*args, **kwargs) # 
    
    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural  = 'Usuarios'
        
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email','name','last_name']  
    
    def natural_key(self):
        return (self.username)  
    
    def __str__(self):
        ##Vizualizador por defecto de un modelo
        return  f'{self.name} {self.last_name}'