# Zain Notes Backend

## NestJS 기본 아키텍처 및 디자인 패턴

NestJS는 모듈(Module) 기반의 구조와 의존성 주입(Dependency Injection)을 활용한 아키텍처를 제공합니다. 각 비즈니스 도메인은 별도의 모듈로 분리하여 유지보수성과 확장성을 높입니다.

### 1. 주요 구성요소 흐름

#### 1) Entity (엔티티)

- 데이터베이스 테이블과 1:1로 매핑되는 클래스입니다.
- TypeORM의 데코레이터(`@Entity`, `@Column` 등)를 사용해 정의합니다.
- 예시: `notes.entity.ts`

```ts
@Entity('notes')
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string | null;

  // ...생성일, 수정일 등
}
```

#### 2) Repository (리포지토리)

- TypeORM에서 엔티티별로 자동 생성되는 데이터 접근 객체입니다.
- NestJS에서는 `@InjectRepository(엔티티)`로 주입받아 사용합니다.
- 직접 커스텀 리포지토리를 만들 수도 있지만, 기본 Repository로 대부분의 CRUD가 가능합니다.

#### 3) Service (서비스)

- 비즈니스 로직을 담당합니다.
- 데이터베이스 접근이 필요할 때 Repository를 주입받아 사용합니다.
- 예시: `notes.service.ts`

```ts
@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private noteRepository: Repository<Note>,
  ) {}

  findAll(): Promise<Note[]> {
    return this.noteRepository.find();
  }
}
```

#### 4) Controller (컨트롤러)

- HTTP 요청을 받아 Service로 위임하고, 응답을 반환합니다.
- 라우팅 경로와 HTTP 메서드(`@Get`, `@Post` 등)를 정의합니다.
- 예시: `notes.controller.ts`

```ts
@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Get('/')
  findAll(): Promise<Note[]> {
    return this.noteService.findAll();
  }
}
```

#### 5) Module (모듈)

- 관련된 엔티티, 서비스, 컨트롤러를 하나로 묶는 단위입니다.
- `@Module` 데코레이터로 정의하며, `imports`, `providers`, `controllers`를 명시합니다.
- 예시: `notes.module.ts`

```ts
@Module({
  imports: [TypeOrmModule.forFeature([Note])],
  providers: [NoteService],
  controllers: [NoteController],
})
export class NotesModule {}
```

#### 6) AppModule

- 모든 비즈니스 모듈을 `imports`에 등록하여 애플리케이션 전체를 구성합니다.
- DB 연결, 환경설정 등 글로벌 설정도 여기서 처리합니다.

```ts
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      /* ... */
    }),
    NotesModule,
    // ...다른 모듈
  ],
})
export class AppModule {}
```

---

## NestJS 기본 디자인 패턴

- **모듈화(Modularization):** 도메인별로 모듈을 분리하여 유지보수성과 확장성을 높임
- **의존성 주입(DI):** 서비스, 리포지토리 등 의존 객체를 생성자 주입 방식으로 관리
- **레이어드 아키텍처:**
  - Controller: HTTP 요청/응답 처리
  - Service: 비즈니스 로직
  - Repository(Entity): 데이터베이스 접근
- **데코레이터 기반 선언적 프로그래밍:** 라우팅, DI, 엔티티 정의 등에서 데코레이터 사용
- **환경설정 분리:** ConfigModule, .env 파일 등으로 환경별 설정 분리

---

## 참고

- NestJS 공식문서: https://docs.nestjs.com/
- TypeORM 공식문서: https://typeorm.io/
