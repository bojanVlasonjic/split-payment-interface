package dipl.spi.spi_backend.model;

import dipl.spi.spi_backend.dto.AccountDto;
import dipl.spi.spi_backend.dto.PaymentSplitDto;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@NoArgsConstructor
@Getter
@Setter
public class PaymentSplit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private double amount;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    private Account account;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    private Article article;

    public PaymentSplit(PaymentSplitDto paymentSplitDto, AppUser user, Article article, Account account) {
        this.id = paymentSplitDto.getId();
        this.amount = paymentSplitDto.getAmount();
        this.article = article;

        if(account != null) {
            this.account = account;
        }

    }

    public void updateValues(PaymentSplitDto paymentSplitDto) {
        this.amount = paymentSplitDto.getAmount();
        this.account.updateValues(paymentSplitDto.getAccount());
    }

}
