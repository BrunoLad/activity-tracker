import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';
import { TokenService } from 'src/app/core/services/token.service';
import { User } from 'src/app/shared/models/user';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	public loginForm: FormGroup;
	public submitted: boolean;
	public typeWriterText = 'Activity Tracker';
	public typeWriterDisplay = '';
	public uploadImage = 'assets/image/logo.png';
	public returnUrl: string;

	get getControls() {
		return this.loginForm.controls;
	}

	constructor(
		private readonly fb: FormBuilder,
		private readonly authService: AuthService,
		private readonly router: Router,
		private readonly toastr: ToastrService,
		private readonly route: ActivatedRoute,
		private readonly tokenService: TokenService
	) {
		this.submitted = false;

		this.loginForm = this.fb.group({
			email: ['', Validators.required],
			secret: ['', Validators.required]
		});

		this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '';
	}

	ngOnInit(): void {
		if (this.tokenService.hasToken() && this.tokenService.isTokenValid()) {
			this.router.navigateByUrl('/dashboard');
		} else {
			this.authService.logout();
		}

		this.typingCallback(this);
	}

	public login(): void {
		const value = this.loginForm.value;
		this.submitted = true;

		if (value.email && value.secret && this.loginForm.valid) {
			const user: User = {
				username: value.email,
				secret: value.secret
			};

			this.authService
				.login(user)
				.subscribe({
					next: (response) => {
						if (!this.returnUrl) {
							this.router.navigateByUrl('/');
						} else {
							this.router.navigateByUrl(this.returnUrl);
						}
					},
					error: (err) => {
						this.toastr.warning(err, 'Erro');
					}
				});
		}
	}

	public typingCallback(target: any): void {
		const totalLength = target.typeWriterText.length;
		const currentLength = target.typeWriterDisplay.length;

		if (currentLength < totalLength) {
			target.typeWriterDisplay += target.typeWriterText[currentLength];
			setTimeout(target.typingCallback, 100, target);
		} else {
			target.typeWriterDisplay = 'Activity Tracker';
		}
	}
}
