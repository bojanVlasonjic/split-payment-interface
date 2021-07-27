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

}
