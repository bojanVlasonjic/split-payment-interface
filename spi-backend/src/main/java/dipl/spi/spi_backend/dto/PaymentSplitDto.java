package dipl.spi.spi_backend.dto;

import dipl.spi.spi_backend.model.PaymentSplit;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class PaymentSplitDto {

    private Long id;
    private Long articleId;
    private double amount;
    private AccountDto account;

    public PaymentSplitDto(PaymentSplit paySplit) {
        this.id = paySplit.getId();
        this.articleId = paySplit.getArticle().getId();
        this.amount = paySplit.getAmount();
        this.account = new AccountDto(paySplit.getAccount());

    }

}
