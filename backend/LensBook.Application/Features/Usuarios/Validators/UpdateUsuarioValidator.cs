using FluentValidation;
using LensBook.Application.Features.Usuarios.DTOs;

namespace LensBook.Application.Features.Usuarios.Validators;

public class UpdateUsuarioValidator : AbstractValidator<UpdateUsuarioRequestDto>
{
    public UpdateUsuarioValidator()
    {
        RuleFor(x => x.Nombre)
            .NotEmpty().WithMessage("El nombre es obligatorio.")
            .MinimumLength(2).WithMessage("El nombre debe tener al menos 2 caracteres.")
            .MaximumLength(100).WithMessage("El nombre no puede superar los 100 caracteres.");
    }
}