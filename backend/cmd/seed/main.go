package main

import (
	"log"

	"github.com/ledufranco/recruitment-system/internal/config"
	"github.com/ledufranco/recruitment-system/internal/database"
	"github.com/ledufranco/recruitment-system/internal/models"
	"github.com/ledufranco/recruitment-system/pkg/utils"
)

func main() {
	log.Println("Starting database seed...")

	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	db, err := database.Connect(&cfg.Database)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	if err := database.Migrate(db); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	log.Println("Creating users...")
	
	adminPassword, _ := utils.HashPassword("admin123")
	candidatePassword, _ := utils.HashPassword("candidate123")

	admin := &models.User{
		Email:        "admin@recruitment.com",
		PasswordHash: adminPassword,
		Role:         models.RoleAdmin,
	}

	candidate1 := &models.User{
		Email:        "joao.silva@email.com",
		PasswordHash: candidatePassword,
		Role:         models.RoleCandidate,
	}

	candidate2 := &models.User{
		Email:        "maria.santos@email.com",
		PasswordHash: candidatePassword,
		Role:         models.RoleCandidate,
	}

	if err := db.Create(admin).Error; err != nil {
		log.Printf("Admin user may already exist: %v", err)
	} else {
		log.Println("✓ Admin user created: admin@recruitment.com / admin123")
	}

	if err := db.Create(candidate1).Error; err != nil {
		log.Printf("Candidate 1 may already exist: %v", err)
	} else {
		log.Println("✓ Candidate created: joao.silva@email.com / candidate123")
	}

	if err := db.Create(candidate2).Error; err != nil {
		log.Printf("Candidate 2 may already exist: %v", err)
	} else {
		log.Println("✓ Candidate created: maria.santos@email.com / candidate123")
	}

	log.Println("Creating job listings...")

	salaryFrontend := 8000.0
	salaryBackend := 9000.0
	salaryFullstack := 10000.0
	salaryDevOps := 11000.0
	salaryMobile := 8500.0

	jobs := []models.Job{
		{
			RecruiterID: admin.ID,
			Title:       "Desenvolvedor Frontend React",
			Description: "Estamos buscando um desenvolvedor Frontend experiente com React, TypeScript e Tailwind CSS. Você irá trabalhar em projetos desafiadores construindo interfaces modernas e responsivas.\n\nRequisitos:\n• 2+ anos de experiência com React\n• TypeScript\n• HTML5, CSS3\n• Git\n• API REST\n\nDiferenciais:\n• Next.js\n• Testes automatizados\n• UI/UX design",
			Salary:      &salaryFrontend,
			Location:    "São Paulo, SP",
			Type:        models.JobTypeRemote,
			Status:      models.JobStatusOpen,
		},
		{
			RecruiterID: admin.ID,
			Title:       "Desenvolvedor Backend Go",
			Description: "Procuramos desenvolvedor Backend com experiência em Go para trabalhar em sistemas de alta performance e escalabilidade.\n\nRequisitos:\n• 3+ anos de experiência com Go\n• APIs RESTful\n• PostgreSQL ou MySQL\n• Docker\n• Microserviços\n\nDiferenciais:\n• Kubernetes\n• Redis\n• RabbitMQ ou Kafka\n• Clean Architecture",
			Salary:      &salaryBackend,
			Location:    "Rio de Janeiro, RJ",
			Type:        models.JobTypeHybrid,
			Status:      models.JobStatusOpen,
		},
		{
			RecruiterID: admin.ID,
			Title:       "Desenvolvedor Full Stack",
			Description: "Buscamos desenvolvedor Full Stack para atuar em projetos completos, do backend ao frontend.\n\nRequisitos:\n• React ou Vue.js\n• Node.js ou Go\n• Bancos de dados SQL\n• Git e metodologias ágeis\n\nO que oferecemos:\n• Ambiente colaborativo\n• Projetos desafiadores\n• Horários flexíveis\n• Vale alimentação e refeição",
			Salary:      &salaryFullstack,
			Location:    "Belo Horizonte, MG",
			Type:        models.JobTypeRemote,
			Status:      models.JobStatusOpen,
		},
		{
			RecruiterID: admin.ID,
			Title:       "DevOps Engineer",
			Description: "Estamos em busca de um DevOps Engineer para melhorar nossa infraestrutura e processos de deploy.\n\nRequisitos:\n• Experiência com AWS, GCP ou Azure\n• Kubernetes\n• Docker\n• CI/CD (Jenkins, GitLab CI, GitHub Actions)\n• Terraform ou Ansible\n• Monitoramento (Prometheus, Grafana)\n\nDiferenciais:\n• Certificações Cloud\n• Experiência com ambientes de produção\n• Shell scripting",
			Salary:      &salaryDevOps,
			Location:    "São Paulo, SP",
			Type:        models.JobTypeOnsite,
			Status:      models.JobStatusOpen,
		},
		{
			RecruiterID: admin.ID,
			Title:       "Desenvolvedor Mobile React Native",
			Description: "Desenvolvedor Mobile para criar aplicativos incríveis para iOS e Android usando React Native.\n\nRequisitos:\n• 2+ anos com React Native\n• JavaScript/TypeScript\n• Integração com APIs\n• Publicação nas stores (App Store e Play Store)\n\nDiferenciais:\n• Expo\n• Redux ou Context API\n• Firebase\n• Push notifications",
			Salary:      &salaryMobile,
			Location:    "Curitiba, PR",
			Type:        models.JobTypeRemote,
			Status:      models.JobStatusOpen,
		},
		{
			RecruiterID: admin.ID,
			Title:       "Tech Lead - Desenvolvimento",
			Description: "Procuramos Tech Lead para liderar time de desenvolvimento e definir arquitetura de soluções.\n\nRequisitos:\n• 5+ anos de experiência em desenvolvimento\n• Experiência liderando times\n• Conhecimento em múltiplas tecnologias\n• Arquitetura de software\n• Metodologias ágeis\n\nResponsabilidades:\n• Liderar time de desenvolvimento\n• Code review\n• Definição de arquitetura\n• Mentoria técnica\n• Planejamento técnico de projetos",
			Location:    "São Paulo, SP",
			Type:        models.JobTypeHybrid,
			Status:      models.JobStatusOpen,
		},
		{
			RecruiterID: admin.ID,
			Title:       "Estágio em Desenvolvimento Web",
			Description: "Oportunidade de estágio para estudantes de tecnologia que desejam iniciar carreira em desenvolvimento web.\n\nRequisitos:\n• Cursando superior em TI, Ciência da Computação ou áreas relacionadas\n• Conhecimento básico em HTML, CSS, JavaScript\n• Git básico\n• Vontade de aprender\n\nO que oferecemos:\n• Mentoria técnica\n• Ambiente de aprendizado\n• Bolsa auxílio\n• Vale transporte e alimentação\n• Possibilidade de efetivação",
			Location:    "Florianópolis, SC",
			Type:        models.JobTypeOnsite,
			Status:      models.JobStatusOpen,
		},
	}

	for _, job := range jobs {
		if err := db.Create(&job).Error; err != nil {
			log.Printf("Job '%s' may already exist: %v", job.Title, err)
		} else {
			log.Printf("✓ Job created: %s", job.Title)
		}
	}

	log.Println("\n🎉 Database seed completed successfully!")
	log.Println("\nLogin credentials:")
	log.Println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
	log.Println("Admin (Recrutador):")
	log.Println("  Email: admin@recruitment.com")
	log.Println("  Senha: admin123")
	log.Println("\nCandidatos:")
	log.Println("  Email: joao.silva@email.com")
	log.Println("  Senha: candidate123")
	log.Println("\n  Email: maria.santos@email.com")
	log.Println("  Senha: candidate123")
	log.Println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
}

