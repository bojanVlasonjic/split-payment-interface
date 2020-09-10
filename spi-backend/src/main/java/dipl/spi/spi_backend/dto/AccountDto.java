package dipl.spi.spi_backend.dto;

import dipl.spi.spi_backend.model.Account;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class AccountDto {

    private Long id;
    private Long userId;

    private String number;
    private String recipientName;
    private String recipientAddress;


    public AccountDto(Account account) {
        this.id = account.getId();
        this.userId = account.getCreator().getId();

        this.number = account.getNumber();
        this.recipientName = account.getRecipientName();
        this.recipientAddress = account.getRecipientAddress();
    }

}
