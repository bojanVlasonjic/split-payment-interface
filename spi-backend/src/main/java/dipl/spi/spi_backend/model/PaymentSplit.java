package dipl.spi.spi_backend.model;

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

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.MERGE)
    private Account account;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Article article;

    public PaymentSplit(PaymentSplitDto paymentSplitDto, AppUser user, Article article) {
        this.id = paymentSplitDto.getId();
        this.amount = paymentSplitDto.getAmount();
        this.account = new Account(paymentSplitDto.getAccount(), user);
        this.article = article;

    }

}
